import { RheaSdkModule } from './rhea-sdk.module';

describe('RheaSdkModule', () => {
  let rheaSdkModule: RheaSdkModule;

  beforeEach(() => {
    rheaSdkModule = new RheaSdkModule();
  });

  it('should create an instance', () => {
    expect(rheaSdkModule).toBeTruthy();
  });
});
