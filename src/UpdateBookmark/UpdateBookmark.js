import React from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './UpdateBookmark.css';

const Required = () => (
  <span className='UpdateBookmarkRequired'>*</span>
);

export default class UpdateBookmark extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }), 
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    description: '',
    rating: 1
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(`https://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: 'GET'
    })
      .then(res => {
        if(!res.ok) {
          return res.json().then(error => Promise.reject(error))
        } 
        return res.json();
      })
      .then(res => {
        this.setState({
          id: res.id,
          title: res.title,
          url: res.url,
          description: res.description,
          rating: res.rating
        })
      })
      .catch(error => {
        console.error(error);
        this.setState({error});
      })
  }  

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value });
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value });
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => Promise.reject(error));
      }
    })
    .then(() => {
      this.resetFields(newBookmark);
      this.context.updateBookmark(newBookmark);
      this.props.history.push('/')
    })
    .catch(error => {
      console.error(error);
      this.setState({error});
    })
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '' 
    })
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error, title, url, description, rating } = this.state;
    return (
      <section className='UpdateBookmark'>
        <h2>Update Bookmark</h2>
        <form className='UpdateBookmarkForm' onSubmit={this.handleSubmit}>
          <div className='UpdateBookmarkError' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <input type='hidden' name='id' />
          <div>
            <label htmlFor='title'>Title {' '} <Required /></label>
            <input type='text' name='title' id='title' placeholder='Website' required value={title} onChange={this.handleChangeTitle} />
          </div>
          <div>
            <label htmlFor='url'>URL {' '} <Required /></label>
            <input type='url' name='url' id='url' placeholder='https://www.google.com/' required value={url} onChange={this.handleChangeUrl} />
          </div>
          <div>
            <label htmlFor='description'>Description</label>
            <textarea name='description' id='description' value={description} onChange={this.handleChangeDescription} />
          </div>
          <div>
            <label htmlFor='rating'>Rating {' '} <Required /></label>
            <textarea type='number' name='rating' id='rating' min='1' max='5' required value={rating} onChange={this.handleChangeRating} />
          </div>
          <div className='UpdateBookmarkButtons'>
            <button type='button' onClick={this.handleClickCancel}>Cancel</button>
            {' '}
            <button type='submit'>Submit</button>
          </div>
        </form>
      </section>
    );
  }
}