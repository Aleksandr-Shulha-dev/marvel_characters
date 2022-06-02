import { useState, useEffect } from 'react';
import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(410);
    const [firstLoading, setFirstLoading] = useState(true);
    const [comicEnded, setComicEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset);
    },[])

    const onRequest = async(offset) => {
        getAllComics(offset)
            .then(onComicsListLoaded);

    }
    
    const onComicsListLoaded = (comicsList) => {
        const ended = comicsList.length < 12;

        setComicsList(comics => [...comics, ...comicsList]);
        setOffset(offset => offset + 9);
        setFirstLoading(false);
        setComicEnded(ended);
    }

    const getMoreComics = (offset) => {
        onRequest(offset);
    }
    
    console.log('comics list');

    const comicElements = comicsList.map((comic, ind) => (
        <li className="comics__item" key={ind}>
            <a href={comic.homepage}>
                <img src={comic.thumbnail} alt="ultimate war" className="comics__item-img" />
                <div className="comics__item-name">{comic.title}</div>
                <div className="comics__item-price">{comic.price}</div>
            </a>
        </li>
    ))

    const spinner = loading && firstLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/>: null;
    const clazz = spinner || errorMessage ? 'comics__grid comics__grid--center' : 'comics__grid';

    return (
        <div className="comics__list">
            <ul className={clazz}>
                {spinner}
                {errorMessage}
                {comicElements}
            </ul>
            <button 
                className="button button__main button__long"
                style={{'display': comicEnded ? 'none': 'block'}}>
                <div className="inner" onClick={() => getMoreComics(offset)}>load more</div>
            </button>
        </div>
    )
}

export default ComicsList;