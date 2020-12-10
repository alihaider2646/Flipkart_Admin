import React from 'react';
import Modal from '../../../components/UI/Modal';


const DeleteCategoryModal = (props) => {
    // console.log('delete', checkedArray);
    const { show, handleClose, modalTitle, expandedArray, checkedArray, deleteCategories } = props;

    return (
        <Modal
            show={show}
            handleClose={handleClose}
            modalTitle={modalTitle}

            buttons={[
                {
                    label: "No",
                    color: "primary",
                    onClick: () => {
                        alert('no')
                    }
                },
                {
                    label: "Yes",
                    color: "danger",
                    onClick: deleteCategories
                }
            ]}>
            <h5>Expanded</h5>
            {expandedArray.map((item, index) => <span key={index}>{item.name}</span>)}
            <h5>Checked</h5>
            {checkedArray.map((item, index) => <span key={index}>{item.name}</span>)}
        </Modal>
    )
}

export default DeleteCategoryModal;