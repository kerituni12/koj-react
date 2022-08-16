import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class InsertImage extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertImage', (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true,
      });

      const extendConfig = editor.config.get('extendConfig');
      // Callback executed once the image is clicked.
      view.on('execute', () => {
        extendConfig.emitter.emit('open_modal');
        extendConfig.emitter.on('insert_image', (image) => {
          editor.model.change((writer) => {
            const imageElement = writer.createElement('imageBlock', {
              src: image,
            });

            // Insert the image in the current selection location.
            editor.model.insertContent(
              imageElement,
              editor.model.document.selection
            );
            extendConfig.emitter.emit('close_modal');
          });
        });
      });

      return view;
    });
  }
}
export default InsertImage;
