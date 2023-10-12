import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';
import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = () => {

    const [comics, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(8, offset)
            .then(onComicsLoaded);
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if(newComics.length < 8 ){
            ended = true;
        }
        setComicsList(comics => [...comics, ...newComics]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setComicsEnded(ended);
    }

    const itemRefs = useRef([]);

    function renderComics(arr){
        const items =  arr.map((comic, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (comic.image === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="comics__item"
                    ref={(el) => itemRefs.current[i] = el}
                    key={i}>
                        <a href="#">
                            <img 
                                src={comic.image} 
                                alt={comic.title} 
                                className="comics__item-img"
                                style={imgStyle}/>
                            <div className="comics__item-name">{comic.title}</div>
                            <div className="comics__item-price">{comic.price}</div>
                        </a>
                </li>
               
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderComics(comics);
    const errorMessage = error ? <ErrorMessage/> :  null;
    const spinner = loading && ! newItemLoading ? <Spinner/> :  null;
   
    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
             disabled={newItemLoading}
             style={{'display': comicsEnded ? 'none' : 'block'}}
             onClick={() => {onRequest(offset)}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;