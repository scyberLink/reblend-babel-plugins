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
  initState() {
    const dataIdRef = useRef.bind(this)("", "dataIdRef");
    this.dataIdRef = dataIdRef;
    const [isUpdate, setIsUpdate] = useState.bind(this)(false, "isUpdate");
    this.isUpdate = isUpdate;
    this.setIsUpdate = setIsUpdate;
    const [submitting, setSubmitting] = useState.bind(this)(false, "submitting");
    this.submitting = submitting;
    this.setSubmitting = setSubmitting;
    const [keys, setKeys] = useState.bind(this)([], "keys");
    this.keys = keys;
    this.setKeys = setKeys;
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
      this.setKeys(_fields);
    }, "[this.props.fields]");
    let data = this.props.updates;
    this.data = data;
    useEffect.bind(this)(() => {
      this.data = this.props.updates;
      if (this.data) {
        //@ts-ignore
        this.dataIdRef.current = this.data._id;
        this.setIsUpdate(true);
      } else {
        this.data = {};
        this.keys?.forEach(key => {
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
          this.data[key.key] = value;
        });
      }
    }, "[this.props.updates]");
    const createUser = e => {
      this.setSubmitting(true);
      e.preventDefault();
      const gdFetchOption = {
        url: this.props.url,
        data: this.data
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
        this.setSubmitting(false);
      }).catch(err => {
        toast.error(err.message);
        this.setSubmitting(false);
      });
    };
    this.createUser = createUser;
    const updateUser = e => {
      this.setSubmitting(true);
      e.preventDefault();
      const gdFetchOption = {
        url: this.props.url,
        method: "PATCH",
        data: {
          id: this.dataIdRef.current,
          ...this.data
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
        this.setSubmitting(false);
      }).catch(err => {
        toast.error(err.message);
        this.setSubmitting(false);
      });
    };
    this.updateUser = updateUser;
    const [changeData, setChangeData] = useState.bind(this)(null, "changeData");
    this.changeData = changeData;
    this.setChangeData = setChangeData;
    const tracker = useMemo.bind(this)(() => {
      if (this.changeData) {
        this.data[this.changeData.key] = this.changeData.value;
      }
      return !this.tracker;
    }, "[this.changeData]", "tracker");
    this.tracker = tracker;
  }
  initProps({
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
  html() {
    return this.data && Reblend.construct.bind(this)(Form, {
      onSubmit: e => this.isUpdate ? this.updateUser(e) : this.createUser(e)
    }, Reblend.construct.bind(this)(Row, null, this.keys?.map(({
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
        checked: !!this.data[key],
        onChange: () => this.setChangeData({
          key,
          value: this.data[key] > 0 ? 0 : 1
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
        value: this.data[key],
        onChange: e => this.setChangeData({
          key,
          value: e.target.value
        })
      })));
    }), Reblend.construct.bind(this)(Col, {
      xs: "12",
      className: "p-1"
    }, Reblend.construct.bind(this)(Spinner, {
      loading: this.submitting,
      loadingText: `${this.isUpdate ? "Updating user" : "Creating user"}`
    }, Reblend.construct.bind(this)(Form.Control, {
      size: "sm",
      type: "submit",
      value: `${this.isUpdate ? "Update" : "Create"}`,
      className: "fw-bold utilityLink"
    })))));
  }
}
/* Transformed from function to class */
export default HistoryComponentsForm;