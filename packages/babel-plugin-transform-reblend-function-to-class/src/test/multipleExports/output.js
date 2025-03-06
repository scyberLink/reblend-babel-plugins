/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable multiline-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable require-jsdoc */
import Reblend, { Fragment, useEffect, useRef, useState } from 'reblendjs';
import { Row, Col, Table, Form, Button, Tooltip, OverlayTrigger, InputGroup, Spinner as RSpinner, Card } from 'react-bootstrap';
import SharedConfig from '../../scripts/SharedConfig';
import { ACTIVE, INACTIVE, PENDING_APPROVAL, SUSPENDED, UID } from '../../scripts/config/contants';
import Paginator from './Paginator';
import md5 from '../../scripts/md5';
import { objectEquals } from '../../scripts/misc';
import DoubleClickCopy from './DoubleClickCopy';
import Spinner from './Spinner';
import TRow from './TRow';
import HumanizeTimestamp from '../general/HumanizeTimestamp';
export const dateTransform = {
  out: (rowData, type = 'createdAt') => {
    const timestamp = rowData[type];
    return timestamp?.date || timestamp?.time ? Reblend.construct.bind(this)(HumanizeTimestamp, {
      timestamp: timestamp.date || timestamp.time
    }) : null;
  }
};
export const statusTransform = {
  out: rowData => {
    const statusCode = rowData.status;
    return statusCode == ACTIVE ? Reblend.construct.bind(this)("b", {
      className: "text-success"
    }, "Success") : statusCode == SUSPENDED ? Reblend.construct.bind(this)("b", {
      className: "text-danger"
    }, "Suspended") : statusCode == PENDING_APPROVAL ? Reblend.construct.bind(this)("b", {
      className: "text-warning"
    }, "Pending ", Reblend.construct.bind(this)(RSpinner, {
      animation: "grow",
      variant: "danger",
      size: "sm"
    })) : Reblend.construct.bind(this)("b", {
      className: "text-danger"
    }, "Failed");
  },
  in: statusString => {
    const sst = statusString.toLowerCase();
    return sst.includes('success') ? ACTIVE : sst.includes('suspend') ? SUSPENDED : sst.includes('pending') ? PENDING_APPROVAL : INACTIVE;
  }
};
export const booleanTransform = {
  out: status => {
    return status ? Reblend.construct.bind(this)("b", {
      className: "text-primary"
    }, "True") : Reblend.construct.bind(this)("b", {
      className: "text-black"
    }, "False");
  },
  in: statusString => {
    const sst = statusString.toLowerCase();
    return sst == 'true';
  }
};
const numEquality = [{
  name: 'Equal',
  value: 'e'
}, {
  name: 'Greater OR Equal',
  value: 'gte'
}, {
  name: 'Lesser OR Equal',
  value: 'lte'
}];
export const ASCENDING = 1;
export const DESCENDING = -1;
const sortingOrder = [{
  name: 'Ascending',
  value: ASCENDING
}, {
  name: 'Descending',
  value: DESCENDING
}];
class PaginatedTable extends Reblend {
  static ELEMENT_NAME = "PaginatedTable";
  constructor() {
    super();
  }
  async initState() {
    const [reload, setReload] = useState.bind(this)(false, "reload");
    this.state.reload = reload;
    this.state.setReload = setReload;
    const [fields, setFields] = useState.bind(this)(null, "fields");
    this.state.fields = fields;
    this.state.setFields = setFields;
    const [fieldKeys, setFieldKeys] = useState.bind(this)([], "fieldKeys");
    this.state.fieldKeys = fieldKeys;
    this.state.setFieldKeys = setFieldKeys;
    const [fieldValues, setFieldValues] = useState.bind(this)([], "fieldValues");
    this.state.fieldValues = fieldValues;
    this.state.setFieldValues = setFieldValues;
    const [initQuery, setInitQuery] = useState.bind(this)(null, "initQuery");
    this.state.initQuery = initQuery;
    this.state.setInitQuery = setInitQuery;
    const [query, setQuery] = useState.bind(this)(null, "query");
    this.state.query = query;
    this.state.setQuery = setQuery;
    const [loading, setLoading] = useState.bind(this)(true, "loading");
    this.state.loading = loading;
    this.state.setLoading = setLoading;
    const [results, setResults] = useState.bind(this)(null, "results");
    this.state.results = results;
    this.state.setResults = setResults;
    const [searchKey, setSearchKey] = useState.bind(this)(null, "searchKey");
    this.state.searchKey = searchKey;
    this.state.setSearchKey = setSearchKey;
    const [searchValue, setSearchValue] = useState.bind(this)('', "searchValue");
    this.state.searchValue = searchValue;
    this.state.setSearchValue = setSearchValue;
    const [sortKey, setSortKey] = useState.bind(this)(null, "sortKey");
    this.state.sortKey = sortKey;
    this.state.setSortKey = setSortKey;
    const [sortOrder, setSortOrder] = useState.bind(this)(null, "sortOrder");
    this.state.sortOrder = sortOrder;
    this.state.setSortOrder = setSortOrder;
    const [showSortTip, setShowSortTip] = useState.bind(this)(false, "showSortTip");
    this.state.showSortTip = showSortTip;
    this.state.setShowSortTip = setShowSortTip;
    const [firstDisplay, setFirstDisplay] = useState.bind(this)(true, "firstDisplay");
    this.state.firstDisplay = firstDisplay;
    this.state.setFirstDisplay = setFirstDisplay;
    const [loadingError, setLoadingError] = useState.bind(this)(false, "loadingError");
    this.state.loadingError = loadingError;
    this.state.setLoadingError = setLoadingError;
    const [numEqualityValue, setNumEqualityValue] = useState.bind(this)(numEquality[0].value, "numEqualityValue");
    this.state.numEqualityValue = numEqualityValue;
    this.state.setNumEqualityValue = setNumEqualityValue;
    const uidRef = useRef.bind(this)(SharedConfig.getLocalData(UID), "uidRef");
    this.state.uidRef = uidRef;
    useEffect.bind(this)(() => {
      if (!this.props.noScroll) {
        this.state.sortKey && document.getElementById(this.state.sortKey)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }, "[this.state.results]");
    useEffect.bind(this)(() => {
      !this.state.firstDisplay && this.state.setReload(!this.state.reload);
    }, "[this.props.reload]");
    useEffect.bind(this)(() => {
      this.state.setSearchValue('');
    }, "[this.state.searchKey]");
    useEffect.bind(this)(() => {
      !this.state.firstDisplay && this.state.querySetter();
    }, "[this.state.sortKey, this.state.sortOrder]");
    useEffect.bind(this)(() => {
      !this.state.firstDisplay && this.state.querySetter();
    }, "[this.props.query]");
    useEffect.bind(this)(() => {
      const f = {
        ...this.props.fields
      };
      f.status && !f.status.transform && (f.status.transform = statusTransform);
      f.createdAt && !f.createdAt.transform && (f.createdAt.transform = {
        out: rowData => dateTransform.out(rowData)
      });
      f.updatedAt && !f.updatedAt.transform && (f.updatedAt.transform = {
        out: rowData => dateTransform.out(rowData, 'updatedAt')
      });
      f['createdAt.date'] && !f['createdAt.date'].transform && (f['createdAt.date'].transform = {
        out: rowData => dateTransform.out(rowData)
      });
      f['updatedAt.date'] && !f['updatedAt.date'].transform && (f['updatedAt.date'].transform = {
        out: rowData => dateTransform.out(rowData, 'updatedAt')
      });
      f['createdAt.time'] && !f['createdAt.time'].transform && (f['createdAt.time'].transform = {
        out: rowData => dateTransform.out(rowData)
      });
      f['updatedAt.time'] && !f['updatedAt.time'].transform && (f['updatedAt.time'].transform = {
        out: rowData => dateTransform.out(rowData, 'updatedAt')
      });
      for (const fieldKey in f) {
        if (Object.hasOwnProperty.call(f, fieldKey)) {
          const fieldOptions = f[fieldKey];
          if (fieldOptions.type == Boolean && !fieldOptions?.transform?.out) {
            fieldOptions.transform = {
              out: booleanTransform.out
            };
          }
        }
      }
      const keys = Object.keys(f);
      const values = Object.values(f);
      const defaultSearchKey = this.props.primaryKey ? this.props.primaryKey : keys[0] || null;
      const defaultSortOrder = this.props.sortOrder || ASCENDING;
      const defaultInitQuery = this.props.forCurrentUser ? {
        ...{
          uid: this.state.uidRef.current
        },
        ...this.props.query
      } : this.props.query;
      const newQuery = {
        ...defaultInitQuery
      };
      if (f[defaultSearchKey]?.populated) {
        if (newQuery.populate) {
          newQuery.populate = newQuery.populate.map(path => {
            if (typeof path === 'string') {
              if (path == defaultSearchKey) {
                if (newQuery.$sort) {
                  delete newQuery.$sort;
                }
                return {
                  path,
                  options: {
                    sort: {
                      [f[defaultSearchKey].populatedSortkey]: defaultSortOrder
                    }
                  }
                };
              } else {
                return path;
              }
            }
            return defaultSearchKey;
          });
        }
      } else {
        newQuery.$sort = {
          [defaultSearchKey]: defaultSortOrder
        };
      }
      this.state.setFields(f);
      this.state.setFieldKeys(keys);
      this.state.setFieldValues(values);
      this.state.setSearchKey(defaultSearchKey);
      this.state.setSortKey(defaultSearchKey);
      this.state.setSortOrder(defaultSortOrder);
      this.state.setInitQuery(newQuery);
      this.state.setQuery(newQuery);
    }, "[this.props.fields, this.props.query]");
    const resultSetter = data => {
      if (data) {
        this.state.setResults(data);
        this.props.setData && this.props.setData(data);
      }
      this.state.setLoading(false);
      this.state.firstDisplay && this.state.setFirstDisplay(false);
    };
    this.state.resultSetter = resultSetter;
    const querySetter = e => {
      e?.preventDefault();
      const newQuery = {
        ...this.state.initQuery,
        ...this.props.query
      };
      if (this.state.fields[this.state.sortKey]?.populated) {
        if (newQuery.populate) {
          newQuery.populate = newQuery.populate.map(path => {
            if (typeof path === 'string') {
              if (path == this.state.sortKey) {
                if (newQuery.$sort) {
                  delete newQuery.$sort;
                }
                return {
                  path,
                  options: {
                    sort: {
                      [this.state.fields[this.state.sortKey].populatedSortkey]: this.state.sortOrder
                    }
                  }
                };
              } else {
                return path;
              }
            }
            return this.state.sortKey;
          });
        }
      } else {
        newQuery.$sort = {
          [this.state.sortKey]: this.state.sortOrder
        };
      }
      const trimmedValue = this.state.checkInputTransform(this.state.searchValue?.trim());
      if (trimmedValue && trimmedValue !== '') {
        newQuery[this.state.searchKey] =
        // if is selected a number and also not searching for exact value
        this.state.isSelectedANumber() && this.state.numEqualityValue !== numEquality[0].value ? {
          [`$${this.state.numEqualityValue}`]: this.state.checkInputTransform(this.state.searchValue?.trim())
        } : this.state.checkInputTransform(this.state.searchValue?.trim());
      }
      if (objectEquals(this.state.query, newQuery)) {
        this.state.setLoading(true);
        this.state.setReload(!this.state.reload);
      } else {
        this.state.setLoading(true);
        this.state.setQuery(newQuery);
      }
    };
    this.state.querySetter = querySetter;
    const checkOutputTransform = (field, resultIndex) => {
      const fieldOptions = this.state.fields && this.state.fields[field];
      if (fieldOptions?.transform?.out) {
        const transformedValue = fieldOptions.transform.out(this.state.results[resultIndex]);
        return transformedValue;
      }
      return this.state.results[resultIndex][fieldOptions?.selectionKey || field];
    };
    this.state.checkOutputTransform = checkOutputTransform;
    const checkInputTransform = value => {
      const fieldOptions = this.state.fields && this.state.fields[this.state.searchKey];
      if (fieldOptions?.transform?.in) {
        const transformValue = fieldOptions.transform.in(value);
        return transformValue;
      }
      return value;
    };
    this.state.checkInputTransform = checkInputTransform;
    const isSelectedANumber = () => {
      return this.state.fields && this.state.fields[this.state.searchKey]?.type == Number && !this.state.fields[this.state.searchKey]?.virtual;
    };
    this.state.isSelectedANumber = isSelectedANumber;
    const computeValue = (result, field, index) => {
      const val = this.state.fields[field]?.type == Boolean ? booleanTransform.out(result) : this.state.checkOutputTransform(field, index);
      if (this.state.fields[field]?.virtual) {
        return val;
      } else {
        return this.props.noDoubleClick ? val : Reblend.construct.bind(this)(DoubleClickCopy, {
          noClickOpen: this.props.noClickOpen
        }, val, " ");
      }
    };
    this.state.computeValue = computeValue;
    const sortTip = Reblend.construct.bind(this)(Tooltip, {
      id: "custom-tooltip"
    }, Reblend.construct.bind(this)(Card, null, Reblend.construct.bind(this)("div", {
      className: "text-primary h4 pt-1 pb-0"
    }, "Sorting"), Reblend.construct.bind(this)(Card.Body, {
      className: "p-1"
    }, Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: "12",
      md: "6",
      lg: "6",
      className: "pt-1"
    }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(InputGroup.Text, null, "Sort By"), Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.state.setSortKey(e.target.value.trim()),
      value: this.state.sortKey
    }, this.state.fieldKeys.map((field, i) => this.state.fieldValues[i].hideFromSearch || this.state.fieldValues[i].virtual ? null : Reblend.construct.bind(this)("option", {
      key: md5(field),
      value: field
    }, this.state.fieldValues[i].name))))), Reblend.construct.bind(this)(Col, {
      sm: "12",
      md: "6",
      lg: "6",
      className: "pt-1"
    }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(InputGroup.Text, null, "Sort Order"), Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.state.setSortOrder(e.target.value),
      value: this.state.sortOrder
    }, sortingOrder.map(obj => Reblend.construct.bind(this)("option", {
      key: md5(obj.name),
      value: obj.value
    }, obj.name)))))))));
    this.state.sortTip = sortTip;
  }
  async initProps(props) {
    this.props = {};
    this.props = props;
  }
  async html() {
    return Reblend.construct.bind(this)("div", null, this.props.noControl ? null : Reblend.construct.bind(this)(Form, {
      onSubmit: e => this.state.querySetter(e)
    }, Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: "12",
      md: "6",
      lg: "6"
    }, Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: this.state.isSelectedANumber() ? '8' : '12',
      md: this.state.isSelectedANumber() ? '8' : '12',
      lg: this.state.isSelectedANumber() ? '8' : '12',
      className: "p-1"
    }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.state.setSearchKey(e.target.value.trim()),
      value: this.state.searchKey || this.props.primaryKey || ''
    }, this.state.fieldKeys.map((field, i) => this.state.fieldValues[i].hideFromSearch || this.state.fieldValues[i].virtual ? null : Reblend.construct.bind(this)("option", {
      key: md5(field),
      value: field
    }, this.state.fieldValues[i].name))), Reblend.construct.bind(this)(InputGroup.Text, null, Reblend.construct.bind(this)(OverlayTrigger, {
      overlay: this.state.sortTip,
      placement: "auto",
      trigger: 'manual',
      show: this.state.showSortTip,
      flip: true
    }, Reblend.construct.bind(this)("i", {
      className: "fas fa-sort c-pointer",
      onClick: () => this.state.setShowSortTip(!this.state.showSortTip),
      style: this.state.showSortTip ? {
        backgroundColor: 'blue',
        borderRadius: '10px',
        padding: '4px'
      } : {}
    })), Reblend.construct.bind(this)("style", null, `
                      .tooltip-inner {
                        max-width: 100vw;
                        /* background-color: transparent */
                      }`)), Reblend.construct.bind(this)(InputGroup.Text, null, Reblend.construct.bind(this)("i", {
      className: "fas fa-refresh c-pointer",
      onClick: () => this.state.querySetter()
    })))), this.state.isSelectedANumber() ? Reblend.construct.bind(this)(Col, {
      sm: "4",
      md: "4",
      lg: "4",
      className: "p-1"
    }, Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.state.setNumEqualityValue(e.target.value.trim()),
      defaultValue: this.state.numEqualityValue
    }, numEquality.map(obj => Reblend.construct.bind(this)("option", {
      key: md5(obj.value),
      value: obj.value
    }, obj.name)))) : null)), Reblend.construct.bind(this)(Col, {
      sm: "12",
      md: "6",
      lg: "6",
      className: "p-1"
    }, Reblend.construct.bind(this)("div", {
      className: "form-group d-flex"
    }, this.state.fields && this.state.fields[this.state.searchKey]?.type == Boolean ? Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.state.setSearchValue(e.target.value.trim())
    }, Reblend.construct.bind(this)("option", {
      key: 'false',
      value: 'false'
    }, "False"), Reblend.construct.bind(this)("option", {
      key: 'true',
      value: 'true'
    }, "True")) : Reblend.construct.bind(this)(Form.Control, {
      value: this.state.searchValue,
      required: true,
      type: this.state.fields && this.state.fields[this.state.searchKey]?.type == Number ? 'number' : this.state.fields && this.state.fields[this.state.searchKey]?.type == Date ? 'date' : 'text',
      onChange: e => this.state.setSearchValue(e.target.value.trim() == '' ? '' : e.target.value)
    }), Reblend.construct.bind(this)(Button, {
      variant: "primary",
      type: "submit",
      disabled: this.state.loading,
      style: {
        marginLeft: '-10px',
        borderRadius: '0 5px 5px 0'
      }
    }, Reblend.construct.bind(this)("i", {
      className: "fas fa-search"
    })))))), Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: "12"
    }, this.props.type == 'card' ? Reblend.construct.bind(this)(Spinner, {
      loading: this.state.loading,
      loadingError: this.state.loadingError
    }, Reblend.construct.bind(this)("div", {
      className: this.props.cardNotCentered ? 's-start-grid' : 's-grid-justify'
    }, this.state.results?.map((result, resultIndex) => Reblend.construct.bind(this)(Fragment, {
      key: result?._id
    }, this.props?.cardView(result, resultIndex))))) : Reblend.construct.bind(this)(Table, {
      responsive: true,
      striped: true,
      hover: true,
      style: this.props?.style?.tableStyle ? this.props.style.tableStyle : this.props.style,
      className: `${this.props?.className?.tableClass ? this.props?.className?.tableClass : typeof this.props?.className === 'string' ? this.props?.className : ''}`
    }, Reblend.construct.bind(this)("thead", {
      style: this.props?.style?.theadStyle || {},
      className: `${this.props?.className?.theadClass || ''}`
    }, Reblend.construct.bind(this)("tr", null, this.props.numbered ? Reblend.construct.bind(this)("th", {
      key: "#"
    }, "#") : null, this.state.fieldValues.map((field, i) =>
    // Header Cell
    Reblend.construct.bind(this)("th", {
      id: `${this.state.fieldKeys[i] == this.state.sortKey ? this.state.sortKey : ''}`,
      onClick: e => !field.virtual && (this.state.fieldKeys[i] !== this.state.sortKey ? this.state.setSortKey(this.state.fieldKeys[i]) : this.state.setSortOrder(this.state.sortOrder == sortingOrder[0].value ? sortingOrder[1].value : sortingOrder[0].value)),
      className: ` c-pointer ${this.state.fieldKeys[i] !== this.state.sortKey && !field.virtual ? 'utilityLink' : ''}`,
      style: this.state.fieldKeys[i] !== this.state.sortKey ? {} : {
        borderBottom: 'ridge',
        borderBottomColor: 'red',
        color: 'blue'
      },
      key: md5(this.state.fieldKeys[i])
    }, Reblend.construct.bind(this)("div", {
      className: "d-flex justify-content-center align-items-center p-0"
    }, Reblend.construct.bind(this)("span", {
      style: {
        wordWrap: 'normal'
      }
    }, typeof field.name === 'function' ? field.name() : field.name), "\xA0", this.state.fieldKeys[i] !== this.state.sortKey ? null : Reblend.construct.bind(this)("span", null, Reblend.construct.bind(this)("i", {
      className: `fas fa-${this.state.sortOrder == 1 ? this.state.fields[this.state.sortKey].type == Number ? 'sort-numeric-up' : 'sort-alpha-up' : this.state.fields[this.state.sortKey].type == Number ? 'sort-numeric-down' : 'sort-alpha-down'} text-red`
    }))))))), Reblend.construct.bind(this)("tbody", {
      style: this.props?.style?.tbodyStyle || {},
      className: `${this.props?.className?.tbodyClass || ''}`
    }, Reblend.construct.bind(this)(Spinner, {
      loading: this.state.loading,
      loadingError: this.state.loadingError,
      table: {
        colspan: this.state.fieldKeys.length
      }
    }, this.state.results?.map((result, resultIndex) => {
      // Row
      const rowOptions = typeof this.props?.rowOptions === 'function' ? this.props.rowOptions(result) : this.props.rowOptions;
      const t = rowOptions?.title;
      delete rowOptions?.title;
      return rowOptions && rowOptions.noTitleToolTip ? Reblend.construct.bind(this)(TRow, {
        key: result?._id,
        result: result,
        resultIndex: resultIndex,
        style: this.props.style,
        className: this.props.className,
        options: rowOptions,
        numbered: this.props.numbered,
        fieldKeys: this.state.fieldKeys,
        fields: this.state.fields,
        computeValue: this.state.computeValue
      }) : t ? Reblend.construct.bind(this)(OverlayTrigger, {
        key: result?._id,
        delay: {
          show: 500,
          hide: 0
        },
        overlay: Reblend.construct.bind(this)(Tooltip, {
          id: "tooltip"
        }, t),
        placement: "auto"
      }, Reblend.construct.bind(this)(TRow, {
        result: result,
        resultIndex: resultIndex,
        style: this.props.style,
        className: this.props.className,
        options: rowOptions,
        numbered: this.props.numbered,
        fieldKeys: this.state.fieldKeys,
        fields: this.state.fields,
        computeValue: this.state.computeValue
      })) : Reblend.construct.bind(this)(TRow, {
        key: result?._id,
        result: result,
        resultIndex: resultIndex,
        style: this.props.style,
        className: this.props.className,
        options: rowOptions,
        numbered: this.props.numbered,
        fieldKeys: this.state.fieldKeys,
        fields: this.state.fields,
        computeValue: this.state.computeValue
      });
    })))))), Reblend.construct.bind(this)(Row, {
      className: "pt-2"
    }, Reblend.construct.bind(this)(Col, {
      sm: "12"
    }, Reblend.construct.bind(this)(Paginator, {
      url: this.props.url,
      dataName: this.props.dataName,
      query: this.state.query,
      size: this.props.size,
      setResults: this.state.resultSetter,
      reload: this.state.reload,
      setLoadingError: this.state.setLoadingError,
      hidden: this.props.hidePaginator,
      noPaginator: this.props.noPaginator
    }))));
  }
}
/* Transformed from function to class */
PaginatedTable.defaultProps = {
  numbered: true,
  forCurrentUser: true
  // noControl: true, #if it does not support searching but can sort
};
export default PaginatedTable;