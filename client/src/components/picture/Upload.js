import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, InputLabel } from '@material-ui/core';
import FileUpload from '@material-ui/icons/FileUpload';
import { WithContext as ReactTags } from 'react-tag-input';
import './Upload.css';
axios.defaults.withCredentials = true;

const keyCodes = {
	comma: 188,
	enter: 13,
};

const delimiters = [keyCodes.comma, keyCodes.enter];

export default class Upload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			images: '',
			tags: [{ id: '1', text: 'Pic Me' }],
			// suggestions: [
			//   {id: 'Nickname', text: 'Nickname'}
			// ]
		};

		// tag handlers
		this.handleAddition = this.handleAddition.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleDrag = this.handleDrag.bind(this);

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	handleDelete(i) {
		const { tags } = this.state;
		this.setState({
			tags: tags.filter((tag, index) => index !== i),
		});
	}

	handleAddition(tag) {
		this.setState(state => ({ tags: [...state.tags, tag] }));
	}

	handleDrag(tag, currPos, newPos) {
		const tags = [...this.state.tags];
		const newTags = tags.slice();

		newTags.splice(currPos, 1);
		newTags.splice(newPos, 0, tag);

		this.setState({ tags: newTags });
	}

	onChange = e => {
		const state = this.state;

		switch (e.target.name) {
			case 'images':
				state.images = e.target.files[0];
				break;
			default:
				state[e.target.name] = e.target.value;
		}
		console.log(this.state.tags);

		this.setState(state);
	};

	onSubmit = e => {
		e.preventDefault();
		const { tags, images } = this.state;
		console.log('Tags:', tags);

		let formData = new FormData();

		formData.append('tags', JSON.stringify(tags));
		// formData.append('tags', tags.map(i => i.text));
		formData.append('images', images);
		// axios.get('api/pictures');
		axios
			.post('/api/pictures/upload', formData)
			.then(res => {
				console.log('upload successful');
				this.props.history.push('/picture_my_uploads');
			})
			.catch(err => console.log('Must be logged in to upload photos.'));

		// this.refs.tags.value = '';
		this.refs.images.value = '';
	};

	render() {
		const { tags } = this.state;
		return (
			// ? <h2>Upload success</h2> : <h1>Begin upload</h1>
			// Todo if user is not authenticated render a helpful message
				<form onSubmit={this.onSubmit}>
        <div className="content">
          <div className="box">
              <Input
                // style={{ display: 'flex' }}
                type="file"
                id="file"
                name="images"
                // multiple
                ref="images"
                onChange={this.onChange}
                className="inputfile"
              />
            <label htmlFor="file">
              Select a File
            </label>
          </div>

            <div>
            <InputLabel>
              Add Tags with comma
            </InputLabel>
              <ReactTags
                tags={tags}
                //  suggestions={suggestions}
                handleDelete={this.handleDelete}
                handleAddition={this.handleAddition}
                handleDrag={this.handleDrag}
                delimiters={delimiters}
              />
              {/* <input
            style={{ display: "flex"}}
            type="text"
            name="tags"
            value={tags}
            ref="tags"
            onChange={this.onChange}
          /> */}
          </div>
          <hr/>
          <div>
            <Button variant="raised" color="primary" type="submit">Submit
              <FileUpload />
            </Button>
          </div>

        </div>
				</form>
		);
	}
}
