import { ExpressWrapper } from './ExpressWrapper';

const mockExpApp: { [key: string]: jest.Mock<any, any> } = {
    use: jest.fn(),
    get: jest.fn(),
    checkout: jest.fn(),
    listenSuccess: jest.fn((port, addr, cb) => cb()),
    listenFail: jest.fn(() => {
        throw new Error();
    })
};

jest.mock('express', () => {
    return jest.fn().mockImplementation(() => {
        return mockExpApp;
    });
});

describe('Constructor', () => {
    test('expApp.use is called at least once', () => {
        new ExpressWrapper();
        expect(mockExpApp.use).toHaveBeenCalled();
    });
});

describe('startListening', () => {
    beforeAll(() => {});

    test('expApp.listen is called only after calling startListening', async () => {
        mockExpApp.listen = mockExpApp.listenSuccess;

        new ExpressWrapper();

        expect(mockExpApp.listen).not.toHaveBeenCalled();
    });

    test('expApp.listen is called only after calling startListening', async () => {
        mockExpApp.listen = mockExpApp.listenSuccess;

        await new ExpressWrapper().startListening();

        expect(mockExpApp.listen).toHaveBeenCalled();
    });

    test('expApp.listen is called only after calling startListening', async () => {
        mockExpApp.listen = mockExpApp.listenFail;

        {
            const wrapper = new ExpressWrapper();
            const catcher = jest.fn();

            // @ts-ignore
            wrapper.listenPort = 65536;
            await wrapper.startListening().catch(catcher);

            expect(mockExpApp.listen).toHaveBeenCalled();
            expect(catcher).toHaveBeenCalled();
        }
    });
});

describe('armEndpoint', () => {
    const wrapper = new ExpressWrapper();

    // Just test the one on the top of the list of supported methods
    test('checkout', () => {
        mockExpApp.get.mockClear();
        wrapper.armEndpoint('CHECKOUT', '/', () => void 0);
        expect(mockExpApp.checkout).toHaveBeenCalled();
    });

    test('something unknown', () => {
        wrapper.armEndpoint('GOT', '', null);
        // Assert nothing because coming here without an error is the criteria for a success
        // i.e. Literally nothing should happen
    });
});
