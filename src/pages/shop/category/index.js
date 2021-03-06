import React, { useState, Fragment, useEffect } from 'react';
import { Table, Tag, Popconfirm, Spin, Modal, Row, Col, Button } from 'antd';
import { PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';

import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useFetch from '@/utils/useFetch';
import './index.less'
import CategoryEdit from './CategoryEdit';

const Shop = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const fetch = useFetch()
    const [params] = useSearchParams()
    let shopID = params.get('shopID')
    const [showEditCategoryFlag, setShowEditCategoryFlag] = useState(false)
    const [showFoodListFlag, setShowFoodListFlag] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [dataSource, setDatasource] = useState([])
    const [record, setRecord] = useState({});
    let key = 0
    useEffect(() => {
        const pathname = location.pathname
        shopID = params.get('shopID')
        if (pathname === '/manage/shop/category') {
            setShowFoodListFlag(false)
            init()
        } else if (pathname.startsWith('/manage/shop/category/food')) {
            setShowFoodListFlag(true)
        }
    }, [location]);
    async function init() {
        try {
            setSpinning(true)
            const res = await fetch('/manage/category/list', {
                shopID
            })
            const categoryList = res.map((item) => ({
                key: key++,
                ...item
            }))
            setDatasource(categoryList)
            console.log(res)
        } catch (e) {
            console.log(e)
        } finally {
            setSpinning(false)

        }
    }
    const deleteCategory = (record) => {
        const newDataSource = [...dataSource]
        const findRecordIndex = dataSource.findIndex(item => item.key === record.key)
        if (findRecordIndex) {
            newDataSource.splice(findRecordIndex, 1)
            setDatasource(newDataSource)
        }
    }

    const toFoodList = (record) => {
        const categoryID = record.categoryID
        const categoryName = record.categoryName
        navigate(`food?shopID=${shopID}&categoryID=${categoryID}&categoryName=${categoryName}`)

    }
    const toShowEditCategory = (record) => {
        setRecord({
            ...record,
            shopID
        })
        setShowEditCategoryFlag(true)
    }

    function removeAllCategoryConfirmModal(record) {
        const categoryIDList = dataSource.map((item) => item.categoryID)
        Modal.confirm({
            title: '??????',
            icon: <ExclamationCircleOutlined />,
            content: '???????????????????????????????????????????????????',
            okText: '??????',
            cancelText: '??????',
            onOk: () => toRemoveCategory(categoryIDList)
        });
    }
    function removeCategoryConfirmModal(record) {
        const categoryIDList = [record.categoryID]
        Modal.confirm({
            title: '??????',
            icon: <ExclamationCircleOutlined />,
            content: '???????????????????????????????????????',
            okText: '??????',
            cancelText: '??????',
            onOk: () => toRemoveCategory(categoryIDList)
        });
    }
    async function toRemoveCategory(categoryIDList) {
        try {
           setSpinning(true)
           await fetch('/manage/category/remove', {
               shopID,
               categoryIDList
           })
           init()
        } catch(e) {
           console.log(e)
        } finally {
           setSpinning(false)

        }
    }

    const columns = [
        {
            title: '????????????',
            dataIndex: 'categoryName',

        },
        {
            title: '????????????',
            dataIndex: 'shopOperate',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <Tag color="cyan" onClick={() => toFoodList(record)}>????????????</Tag>
                        <Tag color="green" onClick={() => toShowEditCategory(record)}>????????????</Tag>
                            <Tag color="red" onClick={() => removeCategoryConfirmModal(record)}>????????????</Tag>
                    </Fragment>

                )
            }
        }
    ];

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }
    function toCloseEditModal() {
        setShowEditCategoryFlag(false)
    }
    async function toUpdateCategoryList() {
        toCloseEditModal()
        await init()
    }



    return showFoodListFlag ? <Outlet></Outlet> :
        <Spin spinning={spinning}>
            <Row align="middle" justify="center">
                <Col span={16}>
                    ??????????????????
                </Col>
                <Col span={4}>
                    <Button icon={<PlusOutlined />} type="primary" size="large" onClick={() => toShowEditCategory({})}>????????????</Button>
              

                </Col>
                <Col span={4}>
                    <Button icon={<PlusOutlined />} type="primary" size="large" onClick={() => removeAllCategoryConfirmModal({})}>??????????????????</Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={dataSource} onChange={onChange} rowKey={(record) => record.categoryID}/>
            {
                showEditCategoryFlag ? <CategoryEdit toCloseEditModal={toCloseEditModal} toUpdateCategoryList={toUpdateCategoryList} record={record}></CategoryEdit> : null
            }
        </Spin>
}
export default Shop