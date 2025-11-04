import {Button, ButtonGroup, Tooltip} from '@heroui/react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteProduct, selectIsFavorite, toggleFavorite} from '@/entities/product/model/productUiSlice';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {MdDelete} from 'react-icons/md';
import {ProductId} from '@/entities/product/model/types';

interface ActionsProps {
    id: ProductId;
    className?: string;
}

function Actions({id, className}: ActionsProps) {
    const dispatch = useDispatch();
    const isFav = useSelector(selectIsFavorite(String(id)));
    return (
        <div className={className} onClick={(e) => e.stopPropagation()}>
            <ButtonGroup size="sm" variant="flat">
                <Tooltip
                    content={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                    <Button
                        isIconOnly
                        color={isFav ? 'danger' : 'default'}
                        variant={isFav ? 'solid' : 'flat'}
                        aria-pressed={isFav}
                        aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                        onPress={() => dispatch(toggleFavorite(String(id)))}
                    >
                            {isFav
                                ? <FaHeart />
                                : <FaRegHeart />
                            }
                    </Button>
                </Tooltip>
                <Tooltip color="danger" content="Удалить">
                    <Button
                        isIconOnly
                        color="danger"
                        aria-label="Удалить карточку"
                        variant="flat"
                        onPress={() => dispatch(deleteProduct(String(id)))}
                    >
                        <MdDelete />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
}

export default Actions;