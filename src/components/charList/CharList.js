import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [chars, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(9, offset)
            .then(onCharsLoaded);
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if(newChars.length < 9 ){
            ended = true;
        }
        setCharList(chars => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(char => char.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr){
        const items =  arr.map((char, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    ref={(el) => itemRefs.current[i] = el}
                    key={char.id}
                    onClick={() => {
                        props.onCharSelected(char.id);
                        focusOnItem(i);
                        }}
                    onKeyUp={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(char.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                        <div className="char__name">{char.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
        
    const items = renderItems(chars);
    const errorMessage = error ? <ErrorMessage/> :  null;
    const spinner = loading && ! newItemLoading ? <Spinner/> :  null;
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => {onRequest(offset)}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

export default CharList;