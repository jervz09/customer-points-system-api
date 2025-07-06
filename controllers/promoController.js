import db from '../config/db.js';
import { checkIfExists } from '../utils/queryHelper.js';
import { toSnakeCase } from '../utils/stringHelper.js';
import { buildPaginatedQuery } from '../utils/queryHelper.js';

export const createPromo = async (req, res) => {
	const { promo_name, points } = req.body;
	try {
		const existing = await checkIfExists(
			'promos',
			['promo_name'],
			[promo_name]
		);

		if (existing.some(admin => admin.promo_name === promo_name)) {
			return res.status(400).json({ message: 'Promo Name already exists' });
		}

		const result = await db
			.insertInto('promos')
			.values({
				promo_name,
				points,
				slug: toSnakeCase(promo_name),
				created_by: req.user.user_id,
			})
			.execute();

		res.success({ insertId: result.insertId }, 'Promo added successfully');
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const updatePromo = async (req, res) => {
	const { id } = req.params;
	const { promo_name, points, used } = req.body;

	try {
		await db
			.updateTable('promos')
			.set({ promo_name, points, used, slug: toSnakeCase(promo_name) })
			.where('entity_id', '=', id)
			.executeTakeFirst();
		res.success({}, 'Promo updated successfully');
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to update promo', errors: err });
	}
};

export const getAllPromo = async (req, res) => {
	try {
		const data = await buildPaginatedQuery({
			req,
			db,
			table: 'promos',
			select: [
				'promos.entity_id',
				'promos.promo_name',
				'promos.points',
				'promos.used',
				'promos.created_at',
				'admins.username as created_by_name', // from joined table
			],
			searchableColumns: ['promos.promo_name', 'admins.name'],
			filterableColumns: ['promos.promo_name', 'promos.used', 'admins.name'],
			joins: [
				{
					table: 'admins',
					on: join => join.onRef('promos.created_by', '=', 'admins.entity_id'),
				},
			],
		});

		res.success(data, 'Retrieve all your request');
	} catch (err) {
		console.error(err);
		res.error('Failed to fetch promos');
	}
};

export const getOnePromo = async (req, res) => {
	const id = req.params.id;
	req.query.entity_id = id; // override or inject for filter

	try {
		const data = await buildPaginatedQuery({
			req,
			db,
			table: 'promos as p',
			select: [
				'p.entity_id',
				'p.promo_name',
				'p.points',
				'p.used',
				'p.created_at',
				'a.username as created_by_name', // from joined table
			],
			searchableColumns: ['p.promo_name', 'a.name'],
			filterableColumns: ['p.promo_name', 'p.used', 'a.name'],
			joins: [
				{
					table: 'admins as a',
					on: join => join.onRef('p.created_by', '=', 'a.entity_id'),
				},
			],
		});

		if (data.items.length === 0) {
			return res.error('Promo not found', 404);
		}

		res.success(data.items[0], 'Promo retrieved successfully');
	} catch (err) {
		console.error(err);
		res.error('Failed to fetch promo');
	}
};
const updatePromoStatus = async (id, fieldsToUpdate) => {
	return db
		.updateTable('promos')
		.set(fieldsToUpdate)
		.where('entity_id', '=', id)
		.execute();
};

export const softDeletePromo = async (req, res) => {
	const id = req.params.id;

	try {
		await updatePromoStatus(id, { is_deleted: 1 });
		res.success(null, 'Promo marked as deleted');
	} catch (err) {
		console.error(err);
		res.error('Failed to delete promo');
	}
};

export const deactivatePromo = async (req, res) => {
	const id = req.params.id;

	try {
		await updatePromoStatus(id, { is_active: 0 });
		res.success(null, 'Promo deactivated');
	} catch (err) {
		console.error(err);
		res.error('Failed to deactivate promo');
	}
};

export const activatePromo = async (req, res) => {
	const id = req.params.id;

	try {
		await updatePromoStatus(id, { is_active: 1 });
		res.success(null, 'Promo activated');
	} catch (err) {
		console.error(err);
		res.error('Failed to activate promo');
	}
};
