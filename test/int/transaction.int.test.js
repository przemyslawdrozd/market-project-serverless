const apiUtils = require('../utils/apiUtils');

describe('Int transaction tests', () => {
	beforeAll(() => {
		apiUtils.initBaseUrl();
	});

	describe('transaction flow', () => {
		const TRANS_STATE = {
			transId: '',
			cname: 'testCustomer',
			transStatus: 'PROGRESS',
			cart: [],
			totalPrice: 0,
		};

		const PRODUCT = {
			title: 'testProduct',
			price: 1.01,
			quantity: 2,
		};

		test('200 - Should create transacion', async () => {
			const { data, status } = await apiUtils.createTrans(TRANS_STATE.cname);

			TRANS_STATE.transId = data.transId;
			expect(status).toEqual(200);
			expect(TRANS_STATE).toEqual(data);
		});

		test('200 - Should create new product for test and return productId', async () => {
			const { data, status } = await apiUtils.putItem(PRODUCT);

			PRODUCT.productId = data.productId;
			expect(status).toEqual(200);
			expect(data.productId).not.toBeUndefined();
		});

		// progress trans
		test('200 - Should put 1 item into cart when request is correct', async () => {
			const request = { itemId: PRODUCT.productId, quantity: 1 };
			const { data, status } = await apiUtils.progressTrans(
				TRANS_STATE.transId,
				request
			);

			// expected trans state
			TRANS_STATE.totalPrice += PRODUCT.price;
			TRANS_STATE.cart = data.cart;

			// check
			expect(status).toEqual(200);
			expect(data.totalPrice).toEqual(1.01);
			expect(data.cart).toEqual([
				{
					itemId: PRODUCT.productId,
					title: PRODUCT.title,
					price: PRODUCT.price,
					quantity: 1,
				},
			]);
			expect(TRANS_STATE).toEqual(data);
		});

		test('400 - Should throw error when transId is incorrect', async () => {
			const request = { itemId: PRODUCT.productId, quantity: 1 };
			const response = await apiUtils.progressTrans('incorrect', request);

			expect(response.data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'This transaction is not in progress',
			});
		});

		test('400 - Should throw error when product is not provided', async () => {
			const response = await apiUtils.progressTrans(PRODUCT.transId, undefined);

			expect(response.data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'missing item id',
			});
		});

		test('400 - Should throw error when product id is incorrect', async () => {
			const request = { itemId: 'incorrect', quantity: 1 };
			const response = await apiUtils.progressTrans(
				TRANS_STATE.transId,
				request
			);

			expect(response.data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'The conditional request failed',
			});
		});

		test('400 - Should throw error when product quantity is not available', async () => {
			const request = { itemId: PRODUCT.productId, quantity: 2 };
			const response = await apiUtils.progressTrans(
				TRANS_STATE.transId,
				request
			);

			expect(response.data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'The conditional request failed',
			});
		});

		test('200 - Should close transaction', async () => {
			const { data, status } = await apiUtils.closeTrans(TRANS_STATE.transId);

			TRANS_STATE.transStatus = 'CLOSED';
			delete data.closedTmp;

			expect(status).toEqual(200);
			expect(data).toEqual(TRANS_STATE);
		});

		test('400 - Should throw error when transId is CLOSED', async () => {
			const request = { itemId: PRODUCT.productId, quantity: 2 };
			const response = await apiUtils.progressTrans(
				TRANS_STATE.transId,
				request
			);

			expect(response.data).toEqual({
				statusCode: 400,
				name: 'BadRequest',
				info: 'This transaction is not in progress',
			});
		});
	});
});
