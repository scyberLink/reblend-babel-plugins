/* eslint-disable eqeqeq */
import Reblend, { useRef, useState } from 'reblendjs';
import { ALL_INVENTORY, CREATE_INVENTORY, INVENTORY } from '../../../scripts/config/RestEndpoints';
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable';
import { FaTrash } from 'react-icons/fa';
import ModalBox from '../../general/Modal';
import { Button, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import fetcher from '../../../scripts/SharedFetcher';
import InventoryForm from './inventory/InventoryForm';
import { ACTIVE, INACTIVE } from '../../../scripts/config/contants';
class Inventory extends Reblend {
  static ELEMENT_NAME = "Inventory";
  constructor() {
    super();
  }
  initState() {
    const [reload, setReload] = useState.bind(this)(false, "reload");
    this.reload = reload;
    this.setReload = setReload;
    const [showCreateForm, setShowCreateForm] = useState.bind(this)(false, "showCreateForm");
    this.showCreateForm = showCreateForm;
    this.setShowCreateForm = setShowCreateForm;
    const [itemId, setItemId] = useState.bind(this)('', "itemId");
    this.itemId = itemId;
    this.setItemId = setItemId;
    const [showConfirmDeletion, setShowConfirmDeletion] = useState.bind(this)(false, "showConfirmDeletion");
    this.showConfirmDeletion = showConfirmDeletion;
    this.setShowConfirmDeletion = setShowConfirmDeletion;
    const [updatingData, setUpdatingData] = useState.bind(this)(null, "updatingData");
    this.updatingData = updatingData;
    this.setUpdatingData = setUpdatingData;
    const urlRef = useRef.bind(this)(ALL_INVENTORY, "urlRef");
    this.urlRef = urlRef;
    const fieldsRef = useRef.bind(this)({
      _id: {
        name: 'ID',
        type: String
      },
      item: {
        name: 'Item',
        type: String,
        transform: {
          out: row => Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)("div", {
            className: "text-italic"
          }, row?.item?._id), Reblend.construct.bind(this)("div", {
            className: "fw-bold"
          }, row?.item?.name))
        }
      },
      type: {
        name: 'Type',
        type: String
      },
      department: {
        name: 'Department',
        type: String
      },
      state: {
        name: 'State',
        type: String
      },
      quantity: {
        name: 'Quantity',
        type: String
      },
      unitPrice: {
        name: 'Unit Price',
        type: String
      },
      totalPrice: {
        name: 'Total Price',
        type: String
      },
      status: {
        name: 'Status',
        type: String
      },
      'createdAt.date': {
        name: 'Created',
        type: Date
      },
      'updatedAt.date': {
        name: 'Updated',
        type: Date,
        hideFromSearch: true
      },
      action: {
        name: () => Reblend.construct.bind(this)(Button, {
          onClick: () => {
            this.setShowCreateForm(true);
          },
          style: {
            padding: '5px'
          },
          title: "Create new inventory",
          variant: "warning"
        }, Reblend.construct.bind(this)("i", {
          className: "fas fa-user"
        }), " Create"),
        type: String,
        virtual: true,
        transform: {
          out: this.out
        }
      }
    }, "fieldsRef");
    this.fieldsRef = fieldsRef;
    const queryRef = useRef.bind(this)({
      populate: ['item']
    }, "queryRef");
    this.queryRef = queryRef;
    const deleteInventory = async inventoryId => {
      const fetchData = {
        url: INVENTORY + inventoryId,
        method: 'DELETE'
      };
      let data = null;
      try {
        data = await fetcher.fetch(fetchData);
      } catch (er) {
        toast.error(er.message);
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message || 'Error');
      } else {
        this.setShowConfirmDeletion(false);
        this.setReload(!this.reload);
        toast.success(data?.data?.message || 'Success');
      }
    };
    this.deleteInventory = deleteInventory;
    const out = rowData => {
      return Reblend.construct.bind(this)(ButtonGroup, {
        size: "sm"
      }, Reblend.construct.bind(this)(Button, {
        onClick: () => {
          this.setShowConfirmDeletion(true);
          this.setItemId(rowData._id);
        },
        style: {
          padding: '5px'
        },
        title: "Delete this inventory",
        variant: "danger"
      }, Reblend.construct.bind(this)(FaTrash, null)), Reblend.construct.bind(this)(Button, {
        onClick: () => {
          this.setShowCreateForm(true);
          this.setUpdatingData(rowData);
        },
        style: {
          padding: '5px'
        },
        title: "Edit this inventory",
        variant: "warning"
      }, Reblend.construct.bind(this)("i", {
        className: "fas fa-edit"
      })), Reblend.construct.bind(this)(Button, {
        onClick: () => {
          this.action('cancel', rowData._id, rowData.item);
        },
        style: {
          padding: '5px'
        },
        title: "Cancel",
        variant: "danger"
      }, Reblend.construct.bind(this)("i", {
        className: "fas fa-times"
      })), Reblend.construct.bind(this)(Button, {
        onClick: () => {
          this.action('approve', rowData._id, rowData.item);
        },
        style: {
          padding: '5px'
        },
        title: "Approve",
        variant: "success"
      }, Reblend.construct.bind(this)("i", {
        className: "fas fa-mark"
      })));
    };
    this.out = out;
    const action = async (act, id, item) => {
      const fetchData = {
        url: CREATE_INVENTORY,
        method: 'PATCH',
        data: {
          id,
          item,
          status: act !== 'approve' ? INACTIVE : ACTIVE
        }
      };
      let data = null;
      try {
        data = await fetcher.fetch(fetchData);
      } catch (er) {
        toast.error(er.message);
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message || 'Error');
      } else {
        this.setReload(!this.reload);
        toast.success(data?.data?.message || 'Success');
      }
    };
    this.action = action;
  }
  initProps() {
    this.props = {};
  }
  html() {
    return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)(ModalBox, {
      show: this.showConfirmDeletion,
      onCancel: () => this.setShowConfirmDeletion(false),
      onAccept: () => this.deleteInventory(this.itemId),
      header: Reblend.construct.bind(this)("h2", {
        className: "text-center"
      }, "Confirm Deletion"),
      type: "danger",
      backdrop: true
    }, Reblend.construct.bind(this)("span", null, "Are Sure you want to delete this inventory")), Reblend.construct.bind(this)(ModalBox, {
      show: this.showCreateForm,
      onCancel: () => {
        this.setShowCreateForm(false);
        this.setUpdatingData(null);
      },
      control: false,
      header: Reblend.construct.bind(this)("h2", {
        className: "text-center"
      }, `${this.updatingData ? 'Update' : 'Create'}`, " Inventory"),
      backdrop: true
    }, !this.updatingData ? Reblend.construct.bind(this)(InventoryForm, null) : Reblend.construct.bind(this)(InventoryForm, {
      setReload: () => this.setReload(!this.reload),
      data: this.updatingData
    })), Reblend.construct.bind(this)(PaginatedTable, {
      url: this.urlRef.current,
      dataName: "inventories",
      fields: this.fieldsRef.current,
      query: this.queryRef.current,
      primaryKey: "createdAt.date",
      sortOrder: DESCENDING,
      forCurrentUser: false,
      reload: this.reload
    }));
  }
}
/* Transformed from function to class */
export default Inventory;