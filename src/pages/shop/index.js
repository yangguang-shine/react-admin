import React, { useState, useEffect, Fragment } from 'react';
import { Table, Tag, Popconfirm, Modal, Button, Spin, Space, Row, Col } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
// import ShopEdit from './shopEdit';
import ShopEdit from './ShopEdit';
import BatchImport from './BatchImport';
import useFetch from '@/utils/useFetch';
import { delaySync } from '@/utils/index';
import './index.less'
import { shopImgPath } from '@/config/index'

import { ChromePicker } from 'react-color'

const Shop = (props) => {
    const navigate = useNavigate()
    const fetch = useFetch()
    const [dataSource, setDatasource] = useState([])
    const [record, setRecord] = useState({})
    const [editModalFlag, setEditModalFlag] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [categoryFlag, setCategoryFlag] = useState(false);
    const [batchImportFlag, setBatchImportFlag] = useState(false);
    const location = useLocation()
    let key = 0;
    async function getShopList() {
        const res = await fetch('/manage/shop/list')
        // res.shift()
        const newDataSource = formatDataSource(res)
        setDatasource(newDataSource)
    }
    async function removeShop(shopID) {
        await fetch('/manage/shop/remove', {
            shopID
        });
    }
    function formatDataSource(list = []) {
        return list.map((item) => {
            // item.minus = JSON.stringify([])
            // item.businessTypes = JSON.stringify([])
            key++;
            const shopID = item.shopID
            const imgUrl = item.imgUrl || ''
            const shopName = item.shopName
            const startTime = item.startTime
            const endTime = item.endTime
            const openTiming = `${item.startTime}-${item.endTime}`
            const minus = item.minus
            const minusList = JSON.parse(item.minus)
            const minusInfo = minusList.reduce((str, item) => {
                const reach = item.reach
                const reduce = item.reduce
                return str ? `${str},???${reach}???${reduce}` : `???${reach}???${reduce}`
            }, '')
            const address = item.address
            const latitude = item.latitude
            const longitude = item.longitude
            const location = item.location
            const positionInfo = `${latitude},${longitude}`
            const description = item.description
            const mode = item.mode || 'vertical'
            const modeText = mode === 'vertical' ? '??????' : '??????';
            const mainColor = item.mainColor
            const businessTypes = item.businessTypes
            const businessTypesList = JSON.parse(item.businessTypes)
            const businessTypesInfo = businessTypesList.reduce((str, item) => {
                let type = ''
                if (+item === 1) {
                    type = '??????'
                } else if (+item === 2) {
                    type = '??????'
                } else if (+item === 3) {
                    type = '??????'
                }
                if (type) {
                    return str ? `${str},${type}` : `${type}`
                } else {
                    return str
                }
            }, '')
            const deliverPrice = item.deliverPrice || 0
            const startDeliverPrice = item.startDeliverPrice || 0

            
            return {
                key,
                shopID,
                imgUrl,
                shopName,
                openTiming,
                startTime,
                endTime,
                minus,
                minusList,
                minusInfo,
                address,
                latitude,
                longitude,
                location,
                positionInfo,
                description,
                mode,
                modeText,
                mainColor,
                businessTypes,
                businessTypesList,
                businessTypesInfo,
                deliverPrice,
                startDeliverPrice
            }
        })
    }
    useEffect(() => {
        // location.pathname.startsWith('/shop')
        console.log('location   shop')
        const pathname = location.pathname
        if (pathname === '/manage/shop') {
            setCategoryFlag(false)
            init()
        } else if (pathname.startsWith('/manage/shop/category')) {
            setCategoryFlag(true)
        }
    }, [location])
    async function init() {
        try {
            setSpinning(true)
            await getShopList()
        } catch (error) {
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }
    function toShowEditModalFlag(record) {
        setRecord(record)
        toShowEditModal()
    }
    function toShowEditModal() {
        setEditModalFlag(true)
    }
    function toCloseEditModal() {
        setEditModalFlag(false)
    }
    function toShowBatchImportFlag(record) {
        setRecord(record)
        setBatchImportFlag(true)
    }
    async function toUpdateShopList() {
        try {
            toCloseEditModal()
            setSpinning(true)
            await getShopList()
        } catch (error) {
            console.log('error')
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }
    function removeShopConfirmModal(record) {
        Modal.confirm({
            title: '??????',
            icon: <ExclamationCircleOutlined />,
            content: '????????????????????????????????????????????????',
            okText: '??????',
            cancelText: '??????',
            onOk: () => toRemoveShop(record.shopID)
        });
    }
    async function toRemoveShop(shopID) {
        try {
            setSpinning(true)
            await removeShop(shopID)
            await getShopList()
        } catch (error) {
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }

    function toCategoryList(record) {
        const { shopID } = record
        navigate(`category?shopID=${shopID}`)
        setCategoryFlag(true)
        // history.push({
        //     pathname: '/shop/category',
        //     search: "?shopID=1111",
        // })
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
                    <img src={`${shopImgPath}/${record.imgUrl}`} className="shop-img" alt="" />
                )
            }
        },
        {
            title: '????????????',
            dataIndex: 'shopName',

        },
        {
            title: '????????????',
            dataIndex: 'openTiming',
        },
        {
            title: '????????????',
            dataIndex: 'minusInfo',
        },
        {
            title: '????????????',
            dataIndex: 'address',
        },
        {
            title: '????????????',
            dataIndex: 'description',
        },
        {
            title: '????????????',
            dataIndex: 'modeText',
        },
        {
            title: '????????????',
            dataIndex: 'mainColor   ',
            render: (text, record, index) => {
                return (
                    <div style={{
                        'width': '80px',
                        height: '32px',
                        background: record.mainColor
                    }}></div>
                )
            }
        },
        {
            title: '????????????',
            dataIndex: 'businessTypesInfo',
        },
        {
            title: '????????????',
            dataIndex: 'startDeliverPrice',
        },
        {
            title: '?????????',
            dataIndex: 'deliverPrice',
        },
        {
            title: '????????????',
            dataIndex: 'shopOperate',
            render: (text, record, index) => {
                return (
                    <Space>
                        <Tag color="cyan" onClick={() => toCategoryList(record)}>????????????</Tag>
                        <Tag color="green" onClick={() => toShowEditModalFlag(record)}>????????????</Tag>
                        <Tag color="red" onClick={() => removeShopConfirmModal(record)}>????????????</Tag>
                        <Tag color="blue" onClick={() => toShowBatchImportFlag(record)}>????????????</Tag>
                    </Space>
                )
            }
        }
    ];
    function changeColor(a, b, c) {
        console.log(a, b, c)
    }
const defaultColor = '#4EB5F7'

    return (
        categoryFlag ? <Outlet></Outlet> : <Spin tip="Loading..." spinning={spinning}>
            <Row align="middle" justify="center">
                <Col span={20}>
                    ????????????
                </Col>
                <Col span={4}>
                    <Button icon={<PlusOutlined />} type="primary" size="large" onClick={() => toShowEditModalFlag({
                        mainColor: defaultColor
                    })}>????????????</Button>
                </Col>
            </Row>
            <div>

            </div>

            {/* <div className="home-title flex-row flex-a-center flex-j-between">
                <div>????????????</div>
                <Button icon={<PlusOutlined />} type="primary" size="large" onClick={toAddShop}>????????????</Button>
            </div> */}
            <Table style={{ 'marginTop': '30px' }} columns={columns} dataSource={dataSource} onChange={onChange} rowKey={(record) => record.shopID} />
            {/* {editModalFlag && <ShopEdit toCloseEditModal={toCloseEditModal} toUpdateShopList={toUpdateShopList} record={record} />} */}
            {editModalFlag && <ShopEdit toCloseEditModal={(toCloseEditModal)} toUpdateShopList={toUpdateShopList} record={record} > </ShopEdit>}
            {
                <BatchImport visible={batchImportFlag} record={record} confirm={() => setBatchImportFlag(false)} cancel={() => setBatchImportFlag(false)}></BatchImport>
            }
        </Spin>
    )
}
export default Shop