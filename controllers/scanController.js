import db from '../config/db.js';
import { computePoints } from '../utils/pointsHelper.js';
import { checkIfExists } from '../utils/queryHelper.js';

export const handleScanAuto = async (req, res) => {
	const { qr_token } = req.body;
	let postTimeLogResult, postEarnPointsResult;

	try {
		const customer = await checkIfExists('customers', ['qr_token'], [qr_token]);

		if (!customer.length) {
			return res.error(
				'The customer is having trouble scanning or accessing the QR code.',
				500
			);
		}

		const customer_id = customer[0].entity_id;
		const last_time_log = await getLastTimeLog(customer_id);
		if (!last_time_log || last_time_log.action === 'out') {
			postTimeLogResult = await postTimeLog(
				customer_id,
				'in',
				req.user.user_id
			);
			if (postTimeLogResult) {
				return res.success(
					{},
					'Customer session has been successfully timed in'
				);
			} else {
				return res.error(
					'The customer is experiencing issues with time logs.',
					500
				);
			}
		} else {
			const timeIn = new Date(last_time_log.scanned_at);
			const timeOut = new Date(); // current timestamp
			const durationMinutes = Math.floor((timeOut - timeIn) / (1000 * 60));

			const points = await computePoints(durationMinutes);

			postTimeLogResult = await postTimeLog(
				customer_id,
				'out',
				req.user.user_id
			);

			if (!postTimeLogResult) {
				return res.error(
					'The customer is experiencing issues with time logs.',
					500
				);
			}
			postEarnPointsResult = await postEarnPoints(
				customer_id,
				timeIn.toISOString().slice(0, 10),
				durationMinutes,
				points
			);

			if (!postEarnPointsResult) {
				return res.error(
					'The customer is experiencing issues with earning points.',
					500
				);
			}

			return res.success(
				{
					customer_id,
					duration_minutes: durationMinutes,
					points_earned: points,
				},
				'Customer session has been successfully timed out'
			);
		}
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const handleScanManual = async (req, res) => {
	const { qr_token, duration_minutes } = req.body;

	let postTimeLogResult, postEarnPointsResult;

	if (!qr_token) {
		return res.error('QR Token is required.', 500);
	}
	if (!duration_minutes) {
		return res.error('Duration Minutes is required.', 500);
	}

	try {
		const customer = await checkIfExists('customers', ['qr_token'], [qr_token]);
		if (!customer.length) {
			return res.error(
				'The customer is having trouble scanning or accessing the QR code.',
				500
			);
		}

		const customer_id = customer[0].entity_id;
		const points = await computePoints(duration_minutes);
		postTimeLogResult = await postTimeLog(
			customer_id,
			'manual',
			req.user.user_id
		);
		if (!postTimeLogResult) {
			return res.error(
				'The customer is experiencing issues with time logs.',
				500
			);
		}
		postEarnPointsResult = await postEarnPoints(
			customer_id,
			new Date().toISOString().split('T')[0],
			duration_minutes,
			points
		);

		if (!postEarnPointsResult) {
			return res.error(
				'The customer is experiencing issues with earning points.',
				500
			);
		}

		return res.success(
			{
				customer_id,
				duration_minutes,
				points_earned: points,
			},
			'Customer has successfully logged in and earned points.'
		);
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const getLastTimeLog = async customerId => {
	return await db
		.selectFrom('time_logs')
		.selectAll()
		.where('customer_id', '=', customerId)
		.orderBy('scanned_at', 'desc')
		.limit(1)
		.executeTakeFirst();
};

export const postTimeLog = async (customer_id, action, scanned_by) => {
	try {
		await db
			.insertInto('time_logs')
			.values({
				customer_id,
				action,
				scanned_by,
			})
			.execute();
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export const postEarnPoints = async (
	customer_id,
	log_date,
	duration_minutes,
	points_earned
) => {
	try {
		await db
			.insertInto('earned_points')
			.values({
				customer_id,
				log_date,
				duration_minutes,
				points_earned,
			})
			.execute();
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
