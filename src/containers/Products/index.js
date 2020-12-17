import './style.css'
import React, { useState, useEffect } from 'react';
// Material UI Table Imports
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper, FormControlLabel, Switch
} from '@material-ui/core';
// Material UI Table Imports
import Layout from '../../components/Layout';
import { Row, Col, Button } from 'react-bootstrap';
import Input from '../../components/UI/Input';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProductById } from '../../actions';
import Modal from '../../components/UI/Modal';
import { generatePublicUrl } from '../../urlConfig'


// Material UI Table Stuff

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    // { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
    { id: 'category', numeric: true, disablePadding: true, label: 'Category' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
    { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
    { id: 'Actions', numeric: true, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" />
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        marginTop: '2rem',
        width: '100%',
        marginBottom: theme.spacing(1),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));


// Material UI Table Stuff

const Products = (props) => {
    const { onSubmit } = props;
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [productPictures, setProductPictures] = useState([]);
    const [productDetailModal, setProductDetailModal] = useState(false);
    const [productDetails, setProductDetails] = useState(null);

    // Material UI States
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('price');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    // Material UI States

    const category = useSelector(state => state.category);
    const product = useSelector(state => state.product);
    const dispatch = useDispatch();

    console.log("category object : ", category);
    console.log("product object : ", product, product.products.length);

    // Material UI Functions And Other Stuff

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = product.products.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, product.products.length - page * rowsPerPage);

    // Material UI Functions And Other Stuff

    const handleClose = () => {
        const form = new FormData();
        form.append('name', name);
        form.append('quantity', quantity);
        form.append('price', price);
        form.append('description', description);
        form.append('category', categoryId);
        for (let pic of productPictures) {
            form.append('productPicture', pic);
        }
        dispatch(addProduct(form));
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({ value: category._id, name: category.name });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }
        return options;
    }

    const handleProductPictures = (e) => {
        setProductPictures([
            ...productPictures,
            e.target.files[0]
        ]);
    }

    {/* <Table striped hover style={{ fontSize: 12 }} responsive="sm"> */ }
    {/* <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody>
            {
                product.products.length > 0 ?
                    product.products.map(product =>
                        <tr style={{ cursor: "pointer" }} onClick={() => showProductDetailModal(product)} key={product._id}>
                            <td>1</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.category.name}</td>
                        </tr>) : null
            }

        </tbody> */}
    {/* </Table> */ }

    const renderProducts = () => {
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={product.products.length}
                            />
                            <TableBody>
                                {
                                    product.products.length > 0 ?
                                        stableSort(product.products, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((product, index) => {
                                                const isItemSelected = isSelected(product.name);
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                return (
                                                    <TableRow
                                                        // style={{ cursor: "pointer" }}
                                                        hover
                                                        key={product._id}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        // key={product.name}
                                                        selected={isItemSelected}>
                                                        <TableCell padding="checkbox" />
                                                        <TableCell component="th" id={labelId} scope="row" padding="none">
                                                            {product.name}
                                                        </TableCell>
                                                        {/* <TableCell padding="none">{product.description.length > 100 ? product.description.substring(0, 80) + "..." : product.description}</TableCell> */}
                                                        <TableCell align="center">{product.category.name}</TableCell>
                                                        <TableCell align="center">{product.price}</TableCell>
                                                        <TableCell align="center">{product.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            <Button variant="primary" onClick={() => showProductDetailModal(product)} >Info</Button>
                                                            <Button className="ml-2" variant="danger"
                                                                onClick={() => {
                                                                    const payload = { productId: product._id };
                                                                    dispatch(deleteProductById(payload));
                                                                }}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }) : null
                                }
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={product.products.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </div>
        );

    }

    const renderAddProductModal = () => {
        return (
            <Modal
                show={show}
                handleClose={() => setShow(false)}
                // handleClose={handleClose}
                modalTitle={'Add New Product'}
                onSubmit={handleClose}
            >
                <Input
                    value={name}
                    placeholder={`Product Name`}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    value={quantity}
                    placeholder={`Quantity`}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                    value={price}
                    placeholder={`Price`}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                    value={description}
                    placeholder={`Product Description`}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select value={categoryId} className="form-control mt-4" style={{ cursor: "pointer" }} onChange={(e) => setCategoryId(e.target.value)} >
                    <option>Select Category</option>
                    {
                        createCategoryList(category.categories).map(option =>
                            <option key={option.value} value={option.value}>{option.name}</option>)
                    }
                </select>
                {
                    productPictures.length > 0 ? productPictures.map((pic, index) => <div key={index}>{pic.name}</div>) : null
                }
                <input type="file" name="productPicture" className="mt-4" onChange={handleProductPictures} />
            </Modal>
        );
    }

    const handleCloseProductDetailsModal = () => setProductDetailModal(false);

    const showProductDetailModal = (product) => {
        setProductDetails(product);
        setProductDetailModal(true);
    }

    const renderProductDetailsModal = () => {
        if (!productDetails) {
            return null;
        }
        return (
            <Modal
                show={productDetailModal}
                handleClose={handleCloseProductDetailsModal}
                modalTitle={'Product Details'}
                size="lg"
                onSubmit={handleCloseProductDetailsModal}
            >
                <Row>
                    <Col md="6">
                        <label className="key">Name</label>
                        <p className="value">{productDetails.name}</p>
                    </Col>
                    <Col md="6">
                        <label className="key">Price</label>
                        <p className="value">{productDetails.price}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <label className="key">Quantity</label>
                        <p className="value">{productDetails.quantity}</p>
                    </Col>
                    <Col md="6">
                        <label className="key">Category</label>
                        <p className="value">{productDetails.category.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <label className="key">Desciption</label>
                        <p className="value">{productDetails.description}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label className="key">Product Pictures</label>
                        <div style={{ display: 'flex' }}>
                            {productDetails.productPictures.map(picture =>
                                <div className="productImgContainer">
                                    <img src={generatePublicUrl(picture.img)} />
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Modal>
        )
    }
    return (
        <Layout sidebar>
            <Row>
                <Col md={12}>
                    <div className="mt-3" style={{ display: "flex", justifyContent: "space-between" }}>
                        <h3>Products</h3>
                        <Button variant="primary" onClick={handleShow}>Add Product</Button>
                    </div>
                </Col>
            </Row>
            {renderProducts()}
            {renderAddProductModal()}
            {renderProductDetailsModal()}
        </Layout>
    );
};

export default Products;