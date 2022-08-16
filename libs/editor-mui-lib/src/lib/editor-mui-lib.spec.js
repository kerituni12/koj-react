import { render } from '@testing-library/react';
import EditorMuiLib from './editor-mui-lib';
describe('EditorMuiLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditorMuiLib />);
    expect(baseElement).toBeTruthy();
  });
});
