import './style.css';
import React, { useEffect, useState } from 'react';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import {
    addCategory,
    getAllCategory,
    updateCategories,
    deleteCategories as deleteCategoriesAction
} from '../../actions';
import CheckboxTree from 'react-checkbox-tree';
import { IoIosCheckboxOutline, IoIosCheckbox, IoIosArrowDown, IoIosArrowForward, IoIosTrash, IoIosAdd, IoIosCloudUpload } from 'react-icons/io'
import AddCategoryModal from './components/AddCategoryModal';
import UpdateCategoriesModal from './components/UpdateCategoriesModal';
import DeleteCategoryModal from './components/DeleteCategoryModal';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';

const Category = (props) => {
    const category = useSelector(state => state.category)

    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [checkedArray, setCheckedArray] = useState([]);
    const [expandedArray, setExpandedArray] = useState([]);
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!category.loading) {
            setAddCategoryModal(false);
        }
    }, [category.loading]);

    // const handleShow = () => setShow(true);
    // const handleClose = () => {
    //     const form = new FormData();
    //     // if (categoryName === "") {
    //     //     alert('Category name is required');
    //     //     setShow(false);
    //     //     return;
    //     // }
    //     form.append('name', categoryName);
    //     form.append('parentId', parentCategoryId);
    //     form.append('categoryImage', categoryImage);
    //     dispatch(addCategory(form));
    //     setCategoryName('');
    //     setParentCategoryId('');
    //     setShow(false);
    // }


    const addCategoryForm = () => {
        const form = new FormData();
        if (categoryName === "") {
            alert("Category name is required");
            setAddCategoryModal(false);
            return;
        }
        form.append('name', categoryName);
        form.append('parentId', parentCategoryId);
        form.append('categoryImage', categoryImage);
        dispatch(addCategory(form));
        setCategoryName('');
        setParentCategoryId('');
        setAddCategoryModal(false);
    }
    const addNewCategory = () => setAddCategoryModal(true);

    const renderCategories = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push(
                {
                    // CheckboxTree
                    label: category.name,
                    value: category._id,
                    children: category.children.length > 0 && renderCategories(category.children)
                }
            );
        }
        return myCategories;
    }

    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({
                value: category._id,
                name: category.name,
                parentId: category.parentId,
                type: category.type
            });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }
        return options;
    }

    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0]);
    }

    const updateCategory = () => {
        updateCheckedAndExpandedCategories();
        setUpdateCategoryModal(true);
    }


    const updateCheckedAndExpandedCategories = () => {
        const categories = createCategoryList(category.categories);
        const checkedArray = [];
        const expandedArray = [];
        checked.length > 0 && checked.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value);
            category && checkedArray.push(category);
        })
        expanded.length > 0 && expanded.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value);
            category && expandedArray.push(category);
        })
        setCheckedArray(checkedArray);
        setExpandedArray(expandedArray);
    }

    const handleCategoryInput = (key, value, index, type) => {
        // console.log(value);
        if (type == "checked") {
            const updatedCheckedArray = checkedArray.map((item, _index) =>
                index == _index ? { ...item, [key]: value } : item);
            setCheckedArray(updatedCheckedArray);
        } else if (type == "expanded") {
            const updatedExpandedArray = expandedArray.map((item, _index) =>
                index == _index ? { ...item, [key]: value } : item);
            setExpandedArray(updatedExpandedArray);
        }
    }
    const updateCategoriesForm = () => {
        const form = new FormData();
        expandedArray.forEach((item, index) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        checkedArray.forEach((item, index) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        dispatch(updateCategories(form))
        // dispatching things here or simply in action files both are same 
        // .then(result => {
        //     if (result) {
        //         dispatch(getAllCategory())
        //         setUpdateCategoryModal(false)
        //     }
        // });
        setUpdateCategoryModal(false);
    }

    // updateCategoryModal
    const renderUpdateCategoriesModal = (props) => {
        return (
            <Modal
                show={updateCategoryModal}
                handleClose={updateCategoriesForm}
                modalTitle="Update Categories"
                size="lg">
                <Row>
                    <Col>
                        <h6>Expanded</h6>
                    </Col>
                </Row>
                {
                    expandedArray.length > 0 && expandedArray.map((item, index) =>
                        <Row key={index}>
                            <Col>
                                <Input
                                    value={item.name}
                                    placeholder={`Category Name`}
                                    onChange={(e) => handleCategoryInput('name', e.target.value, index, 'expanded')}
                                />
                            </Col>
                            <Col>
                                <select value={item.parentId}
                                    className="form-control"
                                    style={{ cursor: "pointer" }}
                                    onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'expanded')} >
                                    <option>Select Category</option>
                                    {
                                        createCategoryList(category.categories).map(option =>
                                            <option key={option.value} value={option.value}>{option.name}</option>)
                                    }
                                </select>
                            </Col>
                            <Col>
                                <select className="form-control" style={{ cursor: "pointer" }}>
                                    <option value="">Select Option</option>
                                    <option value="store">Store</option>
                                    <option value="product">Product</option>
                                    <option value="page">Page</option>
                                </select>
                            </Col>
                        </Row>
                    )
                }
                <Row>
                    <Col>
                        <h6>Checked</h6>
                    </Col>
                </Row>
                {
                    checkedArray.length > 0 && checkedArray.map((item, index) =>
                        <Row key={index}>
                            <Col>
                                <Input
                                    value={item.name}
                                    placeholder={`Category Name`}
                                    onChange={(e) => handleCategoryInput('name', e.target.value, index, 'checked')}
                                />
                            </Col>
                            <Col>
                                <select value={item.parentId}
                                    className="form-control"
                                    style={{ cursor: "pointer" }}
                                    onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'checked')} >
                                    <option>Select Category</option>
                                    {
                                        createCategoryList(category.categories).map(option =>
                                            <option key={option.value} value={option.value}>{option.name}</option>)
                                    }
                                </select>
                            </Col>
                            <Col>
                                <select className="form-control" style={{ cursor: "pointer" }}>
                                    <option value="">Select Option</option>
                                    <option value="store">Store</option>
                                    <option value="product">Product</option>
                                    <option value="page">Page</option>
                                </select>
                            </Col>
                        </Row>
                    )
                }
            </Modal>
        )
    }

    // addCategoryModal
    const renderAddCategoryModal = (props) => {
        return (
            <Modal
                show={addCategoryModal}
                handleClose={addCategoryForm}
                modalTitle="Add New Category">
                <Row>
                    <Col>
                        <Input
                            value={categoryName}
                            placeholder={`Category Name`}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="form-control-sm"
                        />
                    </Col>
                    <Col>
                        <select value={parentCategoryId} className="form-control form-control-sm" style={{ cursor: "pointer" }} onChange={(e) => setParentCategoryId(e.target.value)} >
                            <option>Select Category</option>
                            {
                                createCategoryList(category.categories).map(option =>
                                    <option key={option.value} value={option.value}>{option.name}</option>)
                            }
                        </select>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input type="file" name="categoryImage" className="mt-3" style={{ cursor: "pointer" }} onChange={handleCategoryImage} />
                    </Col>
                </Row>
            </Modal>
        )

    }

    const deleteCategory = () => {
        updateCheckedAndExpandedCategories();
        setDeleteCategoryModal(true);
    }

    const deleteCategories = () => {
        const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }));
        const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }));
        const idsArray = expandedIdsArray.concat(checkedIdsArray);
        if (checkedIdsArray.length > 0) {
            dispatch(deleteCategoriesAction(checkedIdsArray))
                .then(result => {
                    if (result) {
                        dispatch(getAllCategory())
                        setDeleteCategoryModal(false)
                    }
                });
        }
        setDeleteCategoryModal(false);
    }

    // deleteCategoryModal
    const renderDeleteCategoryModal = (props) => {
        return (
            <Modal
                show={deleteCategoryModal}
                handleClose={() => setDeleteCategoryModal(false)}
                modalTitle="Delete Category"
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

    const categoryList = createCategoryList(category.categories);

    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="mt-3" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h3>Category</h3>
                            <div className="actionBtnContainer">
                                <span>Actions:</span>
                                {/* <Button className="ml-2" variant="success" onClick={handleShow}><IoIosAdd /><span> Add</span></Button> */}
                                <Button className="ml-2" variant="success" onClick={addNewCategory}><IoIosAdd /><span> Add</span></Button>
                                <Button className="ml-2" variant="primary" onClick={updateCategory}><IoIosCloudUpload /><span> Edit</span></Button>
                                <Button className="ml-2" variant="danger" onClick={deleteCategory}><IoIosTrash /> <span> Delete</span></Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <CheckboxTree
                            nodes={renderCategories(category.categories)}
                            checked={checked}
                            expanded={expanded}
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                                check: <IoIosCheckbox />,
                                uncheck: <IoIosCheckboxOutline />,
                                halfCheck: <IoIosCheckboxOutline />,
                                expandClose: <IoIosArrowForward />,
                                expandOpen: <IoIosArrowDown />,
                            }}
                        />
                    </Col>
                </Row>

            </Container>
            <AddCategoryModal
                // show={show}
                // handleClose={handleClose}
                show={addCategoryModal}
                handleClose={() => setAddCategoryModal(false)}
                onSubmit={addCategoryForm}
                modalTitle={'Add New Category'}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                parentCategoryId={parentCategoryId}
                setParentCategoryId={setParentCategoryId}
                categoryList={categoryList}
                handleCategoryImage={handleCategoryImage}
            />
            <UpdateCategoriesModal
                show={updateCategoryModal}
                handleClose={() => setUpdateCategoryModal(false)}
                onSubmit={updateCategoriesForm}
                modalTitle={'Update Categories'}
                size="lg"
                expandedArray={expandedArray}
                checkedArray={checkedArray}
                handleCategoryInput={handleCategoryInput}
                categoryList={categoryList}
            />
            <DeleteCategoryModal
                show={deleteCategoryModal}
                handleClose={() => setDeleteCategoryModal(false)}
                modalTitle={'Delete Categories'}
                expandedArray={expandedArray}
                checkedArray={checkedArray}
                deleteCategories={deleteCategories}
            />
            {/* {renderAddCategoryModal()}
            {renderUpdateCategoriesModal()}
            {renderDeleteCategoryModal()} */}
        </Layout>
    );
};

export default Category;