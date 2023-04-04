import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useTable, usePagination, useSortBy } from 'react-table' 
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    // Check if user is admin
    const navigateTo = useNavigate()

    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.adminid != 41){
        setTimeout(() => { navigateTo('/') }, 2000)
        
        return <div style={{ fontSize: 64, position:'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Yetkiniz yok...</div>
    }

    // Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModal] = useState(false);
    const [tempIds, setTempIds] = useState({ pid: '', uid: '' });
    const [inputs, setInputs] = useState({
        postFullName: '',
        title: '',
        description: '',
        category: '',
    });
    const [tempInputs, setTempInputs] = useState({
        tempFullName: '',
        tempTitle: '',
        tempDescription: '',
        tempCategory: '',
    });

    const categories = ['hizmet', 'giyim', 'ilaç', 'erzak', 'konaklama', 'lojistik']

    function openModal() {
      setModalIsOpen(true);
    }
  
    function closeModal() {
      setModalIsOpen(false);
    }

    function openEditModal(){
        setEditModal(true);
    }

    function closeEditModal(){
        setEditModal(false);
    }

    const [posts, setPosts] = useState([])

    const data = React.useMemo(() => posts, [posts])

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Gönderen',
                accessor: 'post_full_name',
            },
            {
                Header: 'Başlık',
                accessor: 'title',
            },
            {
                Header: 'Açıklama',
                accessor: 'shortDesc',
            },
            {
                Header: 'Kategori',
                accessor: 'category',
            },
            {
                Header: 'İletişim',
                accessor: 'contact',
            },
            {
                Header: 'Adres',
                accessor: 'newAddress',
            },
            {
                Header: 'Tarih',
                accessor: 'newDate',
            },
            {
                Header: 'Durum',
                accessor: 'helping_or_seeking',
            },
            {
                Header: 'Onaylandı',
                accessor: 'approved',  
            },
            {
                Header: 'Düzenle',
                accessor: 'editStatus',
                Cell: ({ value }) => (
                    <button className='edit' onClick={ () => { handleEditClick(value) }}>Düzenle</button>
                )
            },
            {
                Header: 'Sil',
                accessor: 'deleteId',
                Cell: ({ value }) => (
                    <button className='delete' onClick={ () => { handleDeleteClick(value) }}>Sil</button>
                )
            },
            {
                Header: 'Onayla',
                accessor: 'approveStatus',
                Cell: ({ value }) => (
                    <button className='approve' disabled={(value.status === 'Onaylandı')}  onClick={ () => { handleApproveClick(value) }}>Onayla</button>
                )
            }
        ],
        []
    )

    const handleEditClick = (status) => {
        setInputs({
            postFullName: status.fullName,
            title: status.title,
            description: status.desc,
            category: status.category,
        })
        setTempIds({ pid: status['id'] })
        setTempInputs({
            tempFullName: status.fullName,
            tempTitle: status.title,
            tempDescription: status.desc,
            tempCategory: status.category,
        })
        openEditModal()
    }

    const handleDeleteClick = (id) => {
        setTempIds({ pid: id['pid'], uid: id['uid'] })
        openModal()
    }

    const blockUser = (id) => {
        axios.post('http://localhost:8080/api/admin/block', { id }, { withCredentials: true })
            .then(res => {
                console.log(res)
                getPosts()
                closeModal()
            }
        )
    }

    const deletePost = (id) => {
        axios.post('http://localhost:8080/api/admin/delete', { id }, { withCredentials: true })
            .then(res => {
                console.log(res)
                getPosts()
                closeModal()
            }
        )
    }

    const editPost = (status) => {
        // compare inputs with tempInputs if there's a change, save it to changes
        let changes = {}
        if (status.tempInputs.tempFullName !== inputs.postFullName) {
            changes['post_full_name'] = status.tempInputs.tempFullName
        }
        if (status.tempInputs.tempTitle !== inputs.title) {
            changes['title'] = status.tempInputs.tempTitle
        }
        if (status.tempInputs.tempDescription !== inputs.description) {
            changes['description'] = status.tempInputs.tempDescription
        }
        if (status.tempInputs.tempCategory !== inputs.category) {
            changes['category'] = status.tempInputs.tempCategory
        }
        if(Object.keys(changes).length === 0) {
            closeEditModal()
            return
        }
        changes['id'] = status.id
        axios.post('http://localhost:8080/api/admin/edit', changes, { withCredentials: true })
            .then(res => {
                console.log(res)
                getPosts()
                closeEditModal()
            }
        )
    }

    const handleApproveClick = (status) => {
        if(!(status.status === 'Onaylandı')){
            axios.post('http://localhost:8080/api/admin/approve', { id: status.id }, { withCredentials: true })
            .then(res => {
                console.log(res)
                getPosts()
            }
        )} 
    }

    const tableInstance = useTable({ columns, data, initialState: { pageIndex: 0 } }, usePagination)

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        prepareRow, 
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        useSortBy,
        state: { pageIndex, pageSize },
    } = tableInstance
    

    const getPosts = async () => {
        const res = await axios.get('http://localhost:8080/api/admin', { withCredentials: true })

        // for each post, manipulate the date
        res.data.forEach(post => {
            let newDate = `${post.date}\n${post.time}`
            let newAddress = `${post.city}\n${post.district}`
            // if description is too long, shorten it after word boundary
            if (post.description.length > 60) {
                post.shortDesc = post.description.substring(0, post.description.lastIndexOf(' ', 60)) + '...'
            } else {
                post.shortDesc = post.description
            }
            if(post.helping_or_seeking == 'recipient') {
                post.helping_or_seeking = 'İhtiyaç Sahibi'
            } else {
                post.helping_or_seeking = 'Yardım Edecek'
            }
            if(post.approved == 'true') {
                post.approved = 'Onaylandı'
            } else {
                post.approved = 'Onaylanmadı'
            }
            post.deleteId = { pid: post.id, uid: post.uid }
            post.approveStatus = { status: post.approved, id: post.id }
            post.editStatus = { fullName: post.post_full_name, title: post.title, desc: post.description, category: post.category ,id: post.id }
            post.newDate = newDate
            post.newAddress = newAddress
        })

        setPosts(res.data)
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div className="admin-table--container">
             {modalIsOpen && (
                <div className='admin-modal'>
                    <div className="admin-modal-container">
                        <span className='admin-close-modal' onClick={closeModal}>X</span>
                        <div className="admin-modal-inner-container">
                            <h1>Kullanıcı engellensin mi? (Gönderi Silinecek)</h1>
                            <button onClick={() => { blockUser(tempIds.uid) }} className='yes'>Evet</button>
                            <button onClick={() => { deletePost(tempIds.pid) }} className='no'>Hayır</button>
                        </div>
                    </div>
                </div>
             )}
             {editModalIsOpen && (
                <div className='edit-modal'>
                    <div className="edit-modal-container">
                        <span className='edit-close-modal' onClick={closeEditModal}>X</span>
                        <div className="edit-modal-inner-container">
                            <div className='edit-modal-form-item'>
                                <p><label htmlFor="fullName">Ad Soyad</label></p>
                                <input id="fullName" value={tempInputs.tempFullName} type="text" onChange={ (e) => { setTempInputs({ ...tempInputs, tempFullName: e.target.value }) }} />
                            </div>
                            
                            <div className="edit-modal-form-item">
                                <p><label htmlFor="title">Başlık</label></p>
                                <input value={tempInputs.tempTitle} id="title" type="text" onChange={ (e) => { setTempInputs({ ...tempInputs, tempTitle: e.target.value }) } } />
                            </div>
                            
                            <div className="edit-modal-textarea">
                                <p><label htmlFor="desc">Açıklama</label></p> 
                                <textarea value={tempInputs.tempDescription} id="desc" rows="4" cols="50" onChange={ (e) => { setTempInputs({ ...tempInputs, tempDescription: e.target.value }) } }></textarea>                          
                            </div>

                            <div className="edit-modal-dropdown">
                                <p><label htmlFor="category">Kategori</label></p>
                                <Select
                                    value={tempInputs.tempCategory}
                                    fullWidth
                                    sx={{textTransform:'capitalize', border: '2px solid #4A2C8F'}}
                                    onChange= {e => setTempInputs(inputs => ({ ...tempInputs, tempCategory: e.target.value }))}
                                >
                                    {categories.map((category, index) => (
                                        <MenuItem key={index} value={category} sx={{ textTransform: 'capitalize' }}>{category}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <button onClick={() => { editPost({ tempInputs, id: tempIds.pid }) }} className='yes'>Gönderiyi Düzenle</button>
                        </div>
                    </div>
                </div>
                )}
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                        </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                }
                                )}
                            </tr>
                        )   
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
                </button>{' '}
                <span>
                Sayfa{' '}
                <strong>
                    {pageIndex + 1} / {pageOptions.length}
                </strong>{' '}
                </span>
                <span>
                | Sayfaya Git:{' '}
                <select className='pagination-select'
                    value={pageIndex}
                    onChange={e => {
                    const page = e.target.value ? Number(e.target.value) : 0
                    gotoPage(page)
                    }}
                >
                    {pageOptions.map((page, index) => (
                    <option key={index} value={index}>
                        {index + 1}
                    </option>
                    ))}
                </select>
                </span>
            </div>
        </div>
        
    )
}

export default AdminPanel