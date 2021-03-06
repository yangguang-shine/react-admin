import React, { useState, useEffect, Fragment } from 'react';
import { Table, Tag, Popconfirm, Modal, Button, Spin, Space, Row, Col } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate,useLocation,  Outlet, useSearchParams } from 'react-router-dom'
import FoodEdit from './FoodEdit';
import Test from './Test';
import useFetch from '@/utils/useFetch';
import './index.less'
import { foodImgPath } from '@/config/index'


const Food = (props) => {
    const navigate = useNavigate()
    const fetch = useFetch()
    const [params] = useSearchParams()
    let shopID = params.get('shopID')
    let categoryID = params.get('categoryID')
    let categoryName = params.get('categoryName')

    const [dataSource, setDatasource] = useState([])
    const [record, setRecord] = useState({})
    const [editModalFlag, setEditModalFlag] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [testFlag, setTestFlag] = useState(false)
    const location = useLocation()
    let key = 0;

    useEffect(() => {
        // location.pathname.startsWith('/shop')
         shopID = params.get('shopID')
         categoryID = params.get('categoryID')
        init()
    }, [location])
    async function getFoodList() {
        const res = await fetch('/manage/food/list', {
            shopID,
            categoryID
        })
        // const newDataSource = formatDataSource(res)
        const foodList = (res || []).map((foodItem => {
            return {
                ...foodItem,
                specification: JSON.parse(foodItem.specification || '[]')
            }
        }))
        setDatasource(foodList)
    }
    async function removeFood(foodID) {
        await fetch('/manage/food/remove', {
            foodID,
            shopID,
            categoryID
        });
    }
    async function init() {
        try {
            setSpinning(true)
            await getFoodList()
        } catch (error) {
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }
    function toShowEditModalFlag(record) {
        toShowEditModal()
        record.specificationList = []
        setRecord({
            ...record,
            shopID,
            categoryID,
            categoryName
        })
    }
    function toShowEditModal() {
        setEditModalFlag(true)
    }
    function toCloseEditModal() {
        setEditModalFlag(false)
    }
    async function toUpdateShopList() {
        try {
            toCloseEditModal()
            setSpinning(true)
            await getFoodList()
        } catch (error) {
            console.log('error')
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }
    function removeFoodConfirmModal(record) {
        Modal.confirm({
            title: '??????',
            icon: <ExclamationCircleOutlined />,
            content: '?????????????????????',
            okText: '??????',
            cancelText: '??????',
            onOk: () => toRemoveFood(record.foodID)
        });
    }
    async function toRemoveFood(foodID) {
        try {
            setSpinning(true)
            await removeFood(foodID)
            await getFoodList()
        } catch (error) {
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }
    function toShowTestFlag() {
        setTestFlag(true)
    }


    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }
    const columns = [
        {
            title: '????????????',
            dataIndex: 'imgUrl',
            render: (text, record, index) => {
                return (
                    <img src={`${foodImgPath}/${shopID}/${record.imgUrl}`} className="shop-img" alt="" />
                )
            }
        },
        {
            title: '????????????',
            dataIndex: 'foodName',

        },
        {
            title: '????????????',
            dataIndex: 'description',
        },
        {
            title: '????????????',
            dataIndex: 'price',
        },
        {
            title: '????????????',
            dataIndex: 'unit',
        },
        {
            title: '????????????',
            dataIndex: 'packPrice',
        },
        {
            title: '????????????',
            dataIndex: 'reserveCount',
        },
        {
            title: '????????????',
            dataIndex: 'foodOperate',
            render: (text, record, index) => {
                return (
                    <Space>
                        <Tag color="green" onClick={() => toShowEditModalFlag(record)}>????????????</Tag>
                        <Tag color="red" onClick={() => removeFoodConfirmModal(record)}>????????????</Tag>
                        <Tag color="red" onClick={() => toShowTestFlag(record)}>????????????</Tag>
                    </Space>
                )
            }
        }
    ];
    return (
        <Spin tip="Loading..." spinning={spinning}>
            <Row align="middle" justify="center">
                <Col span={20}>
                    ????????????
                </Col>
                <Col span={4}>
                    <Button icon={<PlusOutlined />} type="primary" size="large" onClick={() => toShowEditModalFlag({})}>????????????</Button>
                </Col>
            </Row>
            {/* <div className="home-title flex-row flex-a-center flex-j-between">
                <div>????????????</div>
                <Button icon={<PlusOutlined />} type="primary" size="large" onClick={toAddShop}>????????????</Button>
            </div> */}
            <Table style={{ 'marginTop': '30px' }} columns={columns} dataSource={dataSource} onChange={onChange} rowKey={(record) => record.foodID}/>
            {/* {editModalFlag && <FoodEdit toCloseEditModal={toCloseEditModal} toUpdateShopList={toUpdateShopList} record={record} />} */}
            {editModalFlag && <FoodEdit toCloseEditModal={toCloseEditModal} toUpdateShopList={toUpdateShopList} record={record} > </FoodEdit>}
            {/* <Test></Test> */}
        </Spin> 
    )
}
export default Food



// import './index.less'

// const Shop = (props) => {
//     const navigate = useNavigate()
//     const [showEditFoodInfo, setShowEditFoodInfo] = useState(false)
//     const [dataSource, setDatasource] = useState([
//         {
//             key: '1',
//             foodImg: '???????????????',
//             foodName: '???????????????',
//             foodPriice: '???????????????',
//             foodDescriptiion: '???????????????',
//         },
//         {
//             key: '2',
//             foodImg: '???????????????',
//             foodName: '???????????????',
//             foodPriice: '???????????????',
//             foodDescriptiion: '???????????????',
//         }
//     ])
//     const deleteShop = (record) => {
//         const newDataSource = [...dataSource]
//         const findRecordIndex = dataSource.findIndex(item => item.key === record.key)
//         if (findRecordIndex) {
//             newDataSource.splice(findRecordIndex, 1)
//             setDatasource(newDataSource)
//         }
//     }

//     const toShowEditFoodInfo = () => {
//         console.log('bianji')
//         setShowEditFoodInfo(true)
//     }

//     const columns = [
//         {
//             title: '????????????',
//             dataIndex: 'foodImg',
//         },
//         {
//             title: '????????????',
//             dataIndex: 'foodName',

//         },
//         {
//             title: '????????????',
//             dataIndex: 'foodPriice',
//         },
//         {
//             title: '????????????',
//             dataIndex: 'foodDescriptiion',
//         },
//         {
//             title: '????????????',
//             dataIndex: 'foodOperate',
//             render: (text, record, index) => {
//                 return (
//                     <Fragment>
//                         <Tag color="green" onClick= {toShowEditFoodInfo}>????????????</Tag>
//                         <Popconfirm
//                             title="Are you sure delete this task?"
//                             onConfirm={(record) => deleteShop(record)}
//                             okText="Yes"
//                             cancelText="No"
//                         >
//                             <Tag color="red">????????????</Tag>
//                         </Popconfirm>
                        
//                     </Fragment>
//                 )
//             }
//         }
//     ];

//     function onChange(pagination, filters, sorter, extra) {
//         console.log('params', pagination, filters, sorter, extra);
//     }
//     return <Table columns={columns} dataSource={dataSource} onChange={onChange} />
// }
// export default Shop