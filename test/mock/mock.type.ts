export type MockProvider<T> = { [key in keyof T]: jest.Mock };
