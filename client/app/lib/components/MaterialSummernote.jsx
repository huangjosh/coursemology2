import React, { PropTypes } from 'react';
import ReactSummernote from 'react-summernote';
import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';

import '../styles/MaterialSummernote.scss';

const propTypes = {
  field: PropTypes.string,
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  inputId: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
};

const contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

class MaterialSummernote extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFocused: false };
  }

  onChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  onImageUpload = (files) => {
    for (let i = 0; i < files.length; i += 1) {
      this.compressImage(files[i], (dataUrl) => {
        const img = document.createElement('img');
        img.src = dataUrl;
        ReactSummernote.insertNode(img);
      });
    }
  }

  compressImage = (image, onImageCompressed) => {
    // Maximum image size, images larger than this will be compressed
    const IMAGE_MAX_WIDTH = 1920;
    const IMAGE_MAX_HEIGHT = 1080;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');

      img.src = e.target.result;
      let width = img.width;
      let height = img.height;

      if (width <= IMAGE_MAX_WIDTH && height <= IMAGE_MAX_HEIGHT) {
        onImageCompressed(e.target.result);
        return;
      }
      if (width > IMAGE_MAX_WIDTH) {
        height *= IMAGE_MAX_WIDTH / width;
        width = IMAGE_MAX_WIDTH;
      }
      if (height > IMAGE_MAX_HEIGHT) {
        width *= IMAGE_MAX_HEIGHT / height;
        height = IMAGE_MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      onImageCompressed(canvas.toDataURL('image/jpeg'));
    };
    reader.readAsDataURL(image);
  };

  render() {
    const {
      baseTheme,
      textField: {
        focusColor,
        floatingLabelColor,
        disabledTextColor,
        backgroundColor,
      },
    } = this.context.muiTheme;

    const testFieldLabelColor = this.state.isFocused ? focusColor : floatingLabelColor;

    return (
      <div
        key={this.props.field}
        style={{
          fontSize: 16,
          width: '100%',
          display: 'inline-block',
          position: 'relative',
          backgroundColor,
          fontFamily: baseTheme.fontFamily,
          cursor: this.props.disabled ? 'not-allowed' : 'auto',
          paddingTop: '2.5em',
        }}
      >
        <TextFieldLabel
          muiTheme={this.context.muiTheme}
          style={{
            pointerEvents: 'none',
            color: this.props.disabled ? disabledTextColor : testFieldLabelColor,
          }}
          htmlFor={this.props.field}
          shrink
          disabled={this.props.disabled}
        >
          {this.props.label}
        </TextFieldLabel>
        <textarea
          name={this.props.name}
          id={this.props.inputId}
          required={this.props.required}
          value={this.props.value}
          style={{ display: 'none' }}
          onChange={this.onChange}
          disabled={this.props.disabled}
        />
        <div className="material-summernote">
          <ReactSummernote
            options={{
              dialogsInBody: false,
              disabled: this.props.disabled,
              toolbar: [
                ['paragraph-style', ['style']],
                ['font-style', ['bold', 'underline', 'clear']],
                ['font-script', ['superscript', 'subscript']],
                ['font-name', ['fontname']],
                ['color', ['color']],
                ['paragraph', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['misc', ['fullscreen', 'codeview', 'help']],
              ],
            }}
            value={this.props.value}
            onChange={this.props.onChange}
            onFocus={() => { this.setState({ isFocused: true }); }}
            onBlur={() => { this.setState({ isFocused: false }); }}
            onImageUpload={this.onImageUpload}
          />
        </div>
      </div>
    );
  }
}

MaterialSummernote.propTypes = propTypes;
MaterialSummernote.contextTypes = contextTypes;

export default MaterialSummernote;
