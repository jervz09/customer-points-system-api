import db from '../config/db.js';

export const computePoints = async durationMinutes => {
	const point_rule = await db
		.selectFrom('points_rules')
		.select('minutes_per_point')
		.limit(1)
		.orderBy('effective_date', 'desc')
		.executeTakeFirst();
	return Number((durationMinutes / point_rule.minutes_per_point).toFixed(2));
};
