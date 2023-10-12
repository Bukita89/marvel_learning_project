import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicID} = useParams();

    const [comic, setComic] = useState(null);
    const {loading, error, getComic, clearError} = useMarvelService();

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const updateComic = () => {
        clearError();
        getComic(comicID)
                .then(onComicLoaded);
    }

    useEffect(() => {
        updateComic();
    }, [comicID]);

    const errorMessage = error ? <ErrorMessage/> :  null;
    const spinner = loading ? <Spinner/> :  null;
    const content = !( error || loading || !comic ) ? <View comic={comic} /> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, image, price, description, pageCount, language} = comic;
    let imgStyle = {'objectFit' : 'cover'};
    if (comic.image === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }

    return(
        <div className="single-comic">
            <img 
                src={image} 
                alt={title} 
                className="single-comic__img" 
                style={imgStyle}/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">{`Language: ${language}`}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;