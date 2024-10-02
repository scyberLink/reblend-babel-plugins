/* eslint-disable eqeqeq */
import Reblend, { useRef, useState } from 'reblendjs'
import { ALL_INVENTORY, CREATE_INVENTORY, INVENTORY } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { FaTrash } from 'react-icons/fa'
import ModalBox from '../../general/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import fetcher from '../../../scripts/SharedFetcher'
import InventoryForm from './inventory/InventoryForm'
import { ACTIVE, INACTIVE } from '../../../scripts/config/contants'

function Inventory() {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [updatingData, setUpdatingData] = useState(null)

  const urlRef = useRef(ALL_INVENTORY)

  const fieldsRef = useRef({
    _id: { name: 'ID', type: String },
    item: {
      name: 'Item',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.item?._id}</div>
            <div className="fw-bold">{row?.item?.name}</div>
          </>
        ),
      },
    },
    type: { name: 'Type', type: String },
    department: { name: 'Department', type: String },
    state: { name: 'State', type: String },
    quantity: { name: 'Quantity', type: String },
    unitPrice: { name: 'Unit Price', type: String },
    totalPrice: { name: 'Total Price', type: String },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Created', type: Date },
    'updatedAt.date': { name: 'Updated', type: Date, hideFromSearch: true },
    action: {
      name: () => (
        <Button
          onClick={() => {
            setShowCreateForm(true)
          }}
          style={{ padding: '5px' }}
          title="Create new inventory"
          variant="warning"
        >
          <i className="fas fa-user"></i> Create
        </Button>
      ),
      type: String,
      virtual: true,
      transform: { out },
    },
  })

  const queryRef = useRef({ populate: ['item'] })

  async function deleteInventory(inventoryId) {
    const fetchData = {
      url: INVENTORY + inventoryId,
      method: 'DELETE',
    }
    let data = null
    try {
      data = await fetcher.fetch(fetchData)
    } catch (er) {
      toast.error(er.message)
    }
    if (!data?.data?.status) {
      toast.error(data?.data?.message || 'Error')
    } else {
      setShowConfirmDeletion(false)
      setReload(!reload)
      toast.success(data?.data?.message || 'Success')
    }
  }

  function out(rowData) {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={() => {
            setShowConfirmDeletion(true)
            setItemId(rowData._id)
          }}
          style={{ padding: '5px' }}
          title="Delete this inventory"
          variant="danger"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            setUpdatingData(rowData)
          }}
          style={{ padding: '5px' }}
          title="Edit this inventory"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
        <Button
          onClick={() => {
            action('cancel', rowData._id, rowData.item)
          }}
          style={{ padding: '5px' }}
          title="Cancel"
          variant="danger"
        >
          <i className="fas fa-times"></i>
        </Button>
        <Button
          onClick={() => {
            action('approve', rowData._id, rowData.item)
          }}
          style={{ padding: '5px' }}
          title="Approve"
          variant="success"
        >
          <i className="fas fa-mark"></i>
        </Button>
      </ButtonGroup>
    )
  }

  async function action(act, id, item) {
    const fetchData = {
      url: CREATE_INVENTORY,
      method: 'PATCH',
      data: {
        id,
        item,
        status: act !== 'approve' ? INACTIVE : ACTIVE,
      },
    }
    let data = null
    try {
      data = await fetcher.fetch(fetchData)
    } catch (er) {
      toast.error(er.message)
    }
    if (!data?.data?.status) {
      toast.error(data?.data?.message || 'Error')
    } else {
      setReload(!reload)
      toast.success(data?.data?.message || 'Success')
    }
  }

  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteInventory(itemId)}
        header={<h2 className="text-center">Confirm Deletion</h2>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this inventory</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
        }}
        control={false}
        header={<h2 className="text-center">{`${updatingData ? 'Update' : 'Create'}`} Inventory</h2>}
        backdrop
      >
        {!updatingData ? <InventoryForm /> : <InventoryForm setReload={() => setReload(!reload)} data={updatingData} />}
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="inventories"
        fields={fieldsRef.current}
        query={queryRef.current}
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        forCurrentUser={false}
        reload={reload}
      />
    </>
  )
}

export default Inventory
