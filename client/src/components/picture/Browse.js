import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton,
} from '@material-ui/core';
// import ArrowDownwardIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
	othermephotos,
	claimPicture,
	resetPhotoErrors,
	// browse,
	// myuploads,
} from '../../actions';

const styles = theme => ({
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
	},
});

class Browse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			othermes: [],
			modal: false,
			selectedId: '',
		};

		this.toggle = this.toggle.bind(this);
	}

	componentWillMount() {
		this.props.resetPhotoErrors();
		this.props.othermephotos();
	}

	componentWillReceiveProps(nextProps) {
		this.props.resetPhotoErrors();
	}

	renderAlert() {
		if (this.props.error) {
			return (
				<div className="alert alert-danger">
					<strong>Oops!</strong> {this.props.error}
				</div>
			);
		} else if (this.props.photoError) {
			return (
				<div className="alert alert-danger">
					<strong>Oops!</strong> {this.props.photoError}
				</div>
			);
		}
	}

	// toggle for modal window
	toggle(imgId) {
		this.setState({
			selectedId: imgId,
			modal: !this.state.modal,
		});
	}

	claimPictureButtonClickedHandler = _ => {
		this.props.claimPicture(this.state.selectedId);
		this.toggle();
	};

	componentDidMount() {
		this.setState({ othermes: this.props.othermes });
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ othermes: nextProps.othermes });
	}

	render() {
		return (
			<div className="container">
				<h2> Other Me </h2>
				{this.renderAlert()}
				<GridList cellHeight={300} spacing={1} cols={3}>
					{this.state.othermes.map(img => (
						<GridListTile key={img.id} cols={img.cols || 1}>
							<img src={img.url} alt="myuploads" />
							<GridListTileBar
								title={img.tags.map(i => i.text).join(', ')}
								titlePosition="bottom"
								actionIcon={
									<IconButton onClick={_ => this.toggle(img.id)}>
										<FavoriteIcon className="text-white" />
									</IconButton>
								}
								actionPosition="right"
							/>
							<Modal
								isOpen={this.state.modal}
								toggle={this.toggle}
								className={this.props.className}
							>
								<ModalHeader toggle={this.toggle}>Is this you?</ModalHeader>
								<ModalBody>
									Pay 1 credit and add this photo to your collection?
								</ModalBody>
								<ModalFooter>
									<Button
										color="primary"
										onClick={_ => this.claimPictureButtonClickedHandler()}
									>
										Yes
									</Button>{' '}
									<Button color="secondary" onClick={this.toggle}>
										Cancel
									</Button>
								</ModalFooter>
							</Modal>
						</GridListTile>
					))}
				</GridList>
			</div>
		);
	}
}

const mapStatetoProps = state => {
	return {
		authenticated: state.auth.authenticated,
		error: state.auth.error,
		photoError: state.photo.error,
		othermes: state.photo.othermes,
	};
};

const BrowseWrapped = withStyles(styles)(Browse);

export default connect(mapStatetoProps, {
	othermephotos,
	claimPicture,
	resetPhotoErrors,
})(BrowseWrapped);
