import { Row, Col, InputGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Reblend, { useState, useEffect, useRef, useReducer, useMemo } from "reblendjs";
import fetcher from "../../utils/SharedFetcher";
import Spinner from "../general/Spinner";
import { FormEvent } from "react";
import { BaseComponent } from "reblendjs/dist/internal/BaseComponent";
class HistoryComponentsForm extends Reblend {
  static ELEMENT_NAME = "HistoryComponentsForm";
  constructor() {
    super();
  }
  async initState() {
    const dataIdRef = useRef.bind(this)("", "dataIdRef");
    this.state.dataIdRef = dataIdRef;
    const [isUpdate, setIsUpdate] = useState.bind(this)(false, "isUpdate");
    this.state.isUpdate = isUpdate;
    this.state.setIsUpdate = setIsUpdate;
    const [submitting, setSubmitting] = useState.bind(this)(false, "submitting");
    this.state.submitting = submitting;
    this.state.setSubmitting = setSubmitting;
    const [keys, setKeys] = useState.bind(this)([], "keys");
    this.state.keys = keys;
    this.state.setKeys = setKeys;
    useEffect.bind(this)(() => {
      const ignore = ["_id", "__v", "status", "createdAt", "updatedAt"];
      const _fields = [];
      const getType = type => {
        const dictionary = new Map();
        dictionary.set(String, "text");
        dictionary.set(Number, "number");
        dictionary.set(Boolean, "radio");
        return dictionary.get(type);
      };
      for (const [key, value] of Object.entries(this.props.fields || {})) {
        if (!ignore.find(ign => key.includes(ign)) && !value.virtual) {
          _fields.push({
            key,
            type: getType(value.type)
          });
        }
      }
      _fields.push({
        key: "status",
        type: "text"
      });
      this.state.setKeys(_fields);
    }, "[this.props.fields]");
    let data = this.props.updates;
    this.state.data = data;
    useEffect.bind(this)(() => {
      this.state.data = this.props.updates;
      if (this.state.data) {
        //@ts-ignore
        this.state.dataIdRef.current = this.state.data._id;
        this.state.setIsUpdate(true);
      } else {
        this.state.data = {};
        this.state.keys?.forEach(key => {
          const type = this.props.fields[key.key].type;
          let value = "";
          switch (type) {
            case Boolean:
              value = false;
              break;
            case Number:
              value = 0;
              break;
          }
          this.state.data[key.key] = value;
        });
      }
    }, "[this.props.updates]");
    const createUser = e => {
      this.state.setSubmitting(true);
      e.preventDefault();
      const gdFetchOption = {
        url: this.props.url,
        data: this.state.data
      };
      fetcher.fetch(gdFetchOption).then(response => {
        if (response) {
          if (!response.data.status) {
            toast.error(response.data.message);
          } else {
            setPropsData && setPropsData(response.data.created);
            this.props.setReload && this.props.setReload();
            toast.success(response.data.message);
          }
        }
        this.state.setSubmitting(false);
      }).catch(err => {
        toast.error(err.message);
        this.state.setSubmitting(false);
      });
    };
    this.state.createUser = createUser;
    const updateUser = e => {
      this.state.setSubmitting(true);
      e.preventDefault();
      const gdFetchOption = {
        url: this.props.url,
        method: "PATCH",
        data: {
          id: this.state.dataIdRef.current,
          ...this.state.data
        }
      };
      fetcher.fetch(gdFetchOption).then(response => {
        if (response) {
          if (!response.data.status) {
            toast.error(response.data.message);
          } else {
            setPropsData && setPropsData(response.data.created);
            this.props.setReload && this.props.setReload();
            toast.success(response.data.message);
          }
        }
        this.state.setSubmitting(false);
      }).catch(err => {
        toast.error(err.message);
        this.state.setSubmitting(false);
      });
    };
    this.state.updateUser = updateUser;
    const [changeData, setChangeData] = useState.bind(this)(null, "changeData");
    this.state.changeData = changeData;
    this.state.setChangeData = setChangeData;
    const tracker = useMemo.bind(this)(() => {
      if (this.state.changeData) {
        this.state.data[this.state.changeData.key] = this.state.changeData.value;
      }
      return !this.state.tracker;
    }, "[this.state.changeData]", "tracker");
    this.state.tracker = tracker;
  }
  async initProps({
    fields,
    updates = {},
    url,
    setChange,
    setReload = () => {}
  }, thisComponent) {
    this.props = {};
    this.props.fields = fields;
    this.props.updates = updates;
    this.props.url = url;
    this.props.setChange = setChange;
    this.props.setReload = setReload;
    this.thisComponent = thisComponent;
  }
  async html() {
    return this.state.data && Reblend.construct.bind(this)(Form, {
      onSubmit: e => this.state.isUpdate ? this.state.updateUser(e) : this.state.createUser(e)
    }, Reblend.construct.bind(this)(Row, null, this.state.keys?.map(({
      key,
      type
    }) => {
      return key === "status" ? Reblend.construct.bind(this)(Col, {
        xs: "12",
        lg: "6",
        className: "p-1"
      }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(InputGroup.Text, {
        className: "fw-bold",
        style: {
          textTransform: "capitalize"
        }
      }, key, " \xA0\xA0", Reblend.construct.bind(this)(Form.Switch, {
        checked: !!this.state.data[key],
        onChange: () => this.state.setChangeData({
          key,
          value: this.state.data[key] > 0 ? 0 : 1
        })
      })))) : Reblend.construct.bind(this)(Col, {
        xs: "12",
        className: "p-1"
      }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(InputGroup.Text, {
        className: "fw-bold",
        style: {
          textTransform: "capitalize"
        }
      }, key), Reblend.construct.bind(this)(Form.Control, {
        type: type,
        value: this.state.data[key],
        onChange: e => this.state.setChangeData({
          key,
          value: e.target.value
        })
      })));
    }), Reblend.construct.bind(this)(Col, {
      xs: "12",
      className: "p-1"
    }, Reblend.construct.bind(this)(Spinner, {
      loading: this.state.submitting,
      loadingText: `${this.state.isUpdate ? "Updating user" : "Creating user"}`
    }, Reblend.construct.bind(this)(Form.Control, {
      size: "sm",
      type: "submit",
      value: `${this.state.isUpdate ? "Update" : "Create"}`,
      className: "fw-bold utilityLink"
    })))));
  }
}
/* Transformed from function to class */
export default HistoryComponentsForm;