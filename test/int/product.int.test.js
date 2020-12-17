const apiUtils = require('../utils/apiUtils');

describe('Func tests', () => {
	beforeAll(() => {
		apiUtils.initBaseUrl();
	});

	describe('Product CRUD', () => {
		let productId = '15f3c138-3c17-497c-b13d-029f7d0c70c5'; // temp
		// test('200 - Should create new product and return productId', async () => {
		// 	const request = createProduct('testProduct', 1.01, 1);
		// 	const { data, status } = await apiUtils.putItem(request);

		// 	productId = data.productId;
		// 	expect(data.productId).not.toBeUndefined();
		// 	expect(status).toEqual(200);
		// });

		test('400 - Should throw error when title is incorrect', async () => {
			const request = createProduct('incorrect_title');
			const { data } = await apiUtils.putItem(request);

			expect(data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'Invalid title: incorrect_title',
			});
		});

		test('400 - Should throw error when price is incorrect', async () => {
			const request = createProduct('testProduct', 0, 1);
			const { data } = await apiUtils.putItem(request);

			expect(data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'Invalid price: 0',
			});
		});

		test('400 - Should throw error when quantity is incorrect', async () => {
			const request = createProduct('testProduct', 1.01, 0);
			const { data } = await apiUtils.putItem(request);

			expect(data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'Invalid quantity: 0',
			});
		});

		test('200 - Should get item by id', async () => {
			const { data, status } = await apiUtils.getItem(productId);
			expect(data).toEqual({
				...createProduct(),
				itemId: productId,
			});
			expect(status).toEqual(200);
		});

		test('400 - Should gthrow error when id is incorrect', async () => {
			const { data } = await apiUtils.getItem('incorrect');
			expect(data).toEqual({
				statusCode: 404,
				name: 'NotFound',
				info: 'Invalid key: incorrect',
			});
		});

		// todo PUT and DELETE
	});
});

const createProduct = (title = 'testProduct', price = 1.01, quantity = 1) => ({
	title,
	price,
	quantity,
});
