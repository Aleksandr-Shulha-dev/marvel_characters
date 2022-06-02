import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';


const CharList = ({onCharSelected}) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(619);
    const [charEnded, setCharEnded] = useState(false);
    const {loading, error, getAllCharacters} = useMarvelService();

    
    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (chars) => {
        let ended = chars.length < 9;

        setCharList(charList => [...charList, ...chars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }
    
    const charElements = charList.map(char => {
        return <Character 
                    char={char} 
                    key={char.id}
                    getCharId={() => onCharSelected(char.id)} 
                />
    })
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const clazz = spinner || errorMessage ? 'char__grid char__grid--center' : 'char__grid';



    return (
        <div className="char__list">
            <ul className={clazz}>
                {errorMessage}
                {spinner}
                {charElements}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none': 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const Character = ({char, getCharId}) => {
    const {name, thumbnail} = char;
    const imgNotFound = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
    const imgUnset = (thumbnail === imgNotFound) ? {'objectFit' : 'unset'} : null ;

    return (
        <li 
            className="char__item" 
            onClick={getCharId} 
            tabIndex='0'>
            <img src={thumbnail} alt="abyss" style={imgUnset}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;