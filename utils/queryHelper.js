export async function buildPaginatedQuery({
	req,
	db,
	table,
	select = ['*'],
	searchableColumns = [],
	filterableColumns = [],
	joins = [],
}) {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const offset = (page - 1) * limit;
	const search = req.query.search?.trim().toLowerCase() || null;

	let query = db.selectFrom(table);
	let countQuery = db.selectFrom(table);

	// Apply joins if any
	joins.forEach(join => {
		query = query.innerJoin(join.table, join.on);
		countQuery = countQuery.innerJoin(join.table, join.on);
	});

	// Add selected columns
	query = query.select(select);

	// Search
	if (search && searchableColumns.length > 0) {
		query = query.where(eb =>
			eb.or(searchableColumns.map(col => eb(col, 'like', `%${search}%`)))
		);
		countQuery = countQuery.where(eb =>
			eb.or(searchableColumns.map(col => eb(col, 'like', `%${search}%`)))
		);
	}

	// Filters
	for (const column of filterableColumns) {
		const value = req.query[column];
		if (value !== undefined) {
			query = query.where(column, '=', value);
			countQuery = countQuery.where(column, '=', value);
		}
	}
	if (process.env.DEBUG_SQL === 'true') {
		console.log('SQL:', query.limit(limit).offset(offset).compile().sql);
		console.log(
			'PARAMS:',
			query.limit(limit).offset(offset).compile().parameters
		);
	}
	// Execute
	const [items, [{ total }]] = await Promise.all([
		query.limit(limit).offset(offset).execute(),
		countQuery.select(eb => eb.fn.countAll().as('total')).execute(),
	]);

	return {
		items,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}
