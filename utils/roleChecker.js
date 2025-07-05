export const isAdmin = user => user?.role === 'admin';
export const isOperator = user => user?.role === 'operator';
export const isClient = user =>
	user?.role === 'client' || user?.role === 'customer';

export const hasRole = (user, allowedRoles = []) => {
	return allowedRoles.includes(user?.role);
};
