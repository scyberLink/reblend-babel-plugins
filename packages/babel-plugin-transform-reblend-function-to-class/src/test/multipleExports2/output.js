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
  async initState() {
    const [reload, setReload] = useState.bind(this)(false, "reload");
    this.state.reload = reload;
    this.state.setReload = setReload;
    const [showCreateForm, setShowCreateForm] = useState.bind(this)(false, "showCreateForm");
    this.state.showCreateForm = showCreateForm;
    this.state.setShowCreateForm = setShowCreateForm;
    const [itemId, setItemId] = useState.bind(this)('', "itemId");
    this.state.itemId = itemId;
    this.state.setItemId = setItemId;
    const [showConfirmDeletion, setShowConfirmDeletion] = useState.bind(this)(false, "showConfirmDeletion");
    this.state.showConfirmDeletion = showConfirmDeletion;
    this.state.setShowConfirmDeletion = setShowConfirmDeletion;
    const [updatingData, setUpdatingData] = useState.bind(this)(null, "updatingData");
    this.state.updatingData = updatingData;
    this.state.setUpdatingData = setUpdatingData;
    const urlRef = useRef.bind(this)(ALL_INVENTORY);
    this.state.urlRef = urlRef;
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
            this.state.setShowCreateForm(true);
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
          out: this.state.out
        }
      }
    });
    this.state.fieldsRef = fieldsRef;
    const queryRef = useRef.bind(this)({
      populate: ['item']
    });
    this.state.queryRef = queryRef;
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
        this.state.setShowConfirmDeletion(false);
        this.state.setReload(!this.state.reload);
        toast.success(data?.data?.message || 'Success');
      }
    };
    this.state.deleteInventory = deleteInventory;
    const out = rowData => {
      return Reblend.construct.bind(this)(ButtonGroup, {
        size: "sm"
      }, Reblend.construct.bind(this)(Button, {
        onClick: () => {
          this.state.setShowConfirmDeletion(true);
          this.state.setItemId(rowData._id);
        },
        style: {
          padding: '5px'
        },
        title: "Delete this inventory",
        variant: "danger"
      }, Reblend.construct.bind(this)(FaTrash, null)), Reblend.construct.bind(this)(Button, {
        onClick: () => {
          this.state.setShowCreateForm(true);
          this.state.setUpdatingData(rowData);
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
          this.state.action('cancel', rowData._id, rowData.item);
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
          this.state.action('approve', rowData._id, rowData.item);
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
    this.state.out = out;
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
        this.state.setReload(!this.state.reload);
        toast.success(data?.data?.message || 'Success');
      }
    };
    this.state.action = action;
  }
  async initProps() {
    this.props = {};
  }
  async html() {
    return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)(ModalBox, {
      show: this.state.showConfirmDeletion,
      onCancel: () => this.state.setShowConfirmDeletion(false),
      onAccept: () => this.state.deleteInventory(this.state.itemId),
      header: Reblend.construct.bind(this)("h2", {
        className: "text-center"
      }, "Confirm Deletion"),
      type: "danger",
      backdrop: true
    }, Reblend.construct.bind(this)("span", null, "Are Sure you want to delete this inventory")), Reblend.construct.bind(this)(ModalBox, {
      show: this.state.showCreateForm,
      onCancel: () => {
        this.state.setShowCreateForm(false);
        this.state.setUpdatingData(null);
      },
      control: false,
      header: Reblend.construct.bind(this)("h2", {
        className: "text-center"
      }, `${this.state.updatingData ? 'Update' : 'Create'}`, " Inventory"),
      backdrop: true
    }, !this.state.updatingData ? Reblend.construct.bind(this)(InventoryForm, null) : Reblend.construct.bind(this)(InventoryForm, {
      setReload: () => this.state.setReload(!this.state.reload),
      data: this.state.updatingData
    })), Reblend.construct.bind(this)(PaginatedTable, {
      url: this.state.urlRef.current,
      dataName: "inventories",
      fields: this.state.fieldsRef.current,
      query: this.state.queryRef.current,
      primaryKey: "createdAt.date",
      sortOrder: DESCENDING,
      forCurrentUser: false,
      reload: this.state.reload
    }));
  }
}
/* @Reblend: Transformed from function to class */
export default Inventory;