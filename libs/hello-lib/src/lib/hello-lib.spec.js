import { render } from '@testing-library/react';
import HelloLib from './hello-lib';
describe('HelloLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HelloLib />);
    expect(baseElement).toBeTruthy();
  });
});
