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
  initState() {
    const [reload, setReload] = useState.bind(this)(false, "reload");
    this.reload = reload;
    this.setReload = setReload;
    const [fields, setFields] = useState.bind(this)(null, "fields");
    this.fields = fields;
    this.setFields = setFields;
    const [fieldKeys, setFieldKeys] = useState.bind(this)([], "fieldKeys");
    this.fieldKeys = fieldKeys;
    this.setFieldKeys = setFieldKeys;
    const [fieldValues, setFieldValues] = useState.bind(this)([], "fieldValues");
    this.fieldValues = fieldValues;
    this.setFieldValues = setFieldValues;
    const [initQuery, setInitQuery] = useState.bind(this)(null, "initQuery");
    this.initQuery = initQuery;
    this.setInitQuery = setInitQuery;
    const [query, setQuery] = useState.bind(this)(null, "query");
    this.query = query;
    this.setQuery = setQuery;
    const [loading, setLoading] = useState.bind(this)(true, "loading");
    this.loading = loading;
    this.setLoading = setLoading;
    const [results, setResults] = useState.bind(this)(null, "results");
    this.results = results;
    this.setResults = setResults;
    const [searchKey, setSearchKey] = useState.bind(this)(null, "searchKey");
    this.searchKey = searchKey;
    this.setSearchKey = setSearchKey;
    const [searchValue, setSearchValue] = useState.bind(this)('', "searchValue");
    this.searchValue = searchValue;
    this.setSearchValue = setSearchValue;
    const [sortKey, setSortKey] = useState.bind(this)(null, "sortKey");
    this.sortKey = sortKey;
    this.setSortKey = setSortKey;
    const [sortOrder, setSortOrder] = useState.bind(this)(null, "sortOrder");
    this.sortOrder = sortOrder;
    this.setSortOrder = setSortOrder;
    const [showSortTip, setShowSortTip] = useState.bind(this)(false, "showSortTip");
    this.showSortTip = showSortTip;
    this.setShowSortTip = setShowSortTip;
    const [firstDisplay, setFirstDisplay] = useState.bind(this)(true, "firstDisplay");
    this.firstDisplay = firstDisplay;
    this.setFirstDisplay = setFirstDisplay;
    const [loadingError, setLoadingError] = useState.bind(this)(false, "loadingError");
    this.loadingError = loadingError;
    this.setLoadingError = setLoadingError;
    const [numEqualityValue, setNumEqualityValue] = useState.bind(this)(numEquality[0].value, "numEqualityValue");
    this.numEqualityValue = numEqualityValue;
    this.setNumEqualityValue = setNumEqualityValue;
    const uidRef = useRef.bind(this)(SharedConfig.getLocalData(UID), "uidRef");
    this.uidRef = uidRef;
    useEffect.bind(this)(() => {
      if (!this.props.noScroll) {
        this.sortKey && document.getElementById(this.sortKey)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }, "[this.results]");
    useEffect.bind(this)(() => {
      !this.firstDisplay && this.setReload(!this.reload);
    }, "[this.props.reload]");
    useEffect.bind(this)(() => {
      this.setSearchValue('');
    }, "[this.searchKey]");
    useEffect.bind(this)(() => {
      !this.firstDisplay && this.querySetter();
    }, "[this.sortKey, this.sortOrder]");
    useEffect.bind(this)(() => {
      !this.firstDisplay && this.querySetter();
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
          uid: this.uidRef.current
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
      this.setFields(f);
      this.setFieldKeys(keys);
      this.setFieldValues(values);
      this.setSearchKey(defaultSearchKey);
      this.setSortKey(defaultSearchKey);
      this.setSortOrder(defaultSortOrder);
      this.setInitQuery(newQuery);
      this.setQuery(newQuery);
    }, "[this.props.fields, this.props.query]");
    const resultSetter = data => {
      if (data) {
        this.setResults(data);
        this.props.setData && this.props.setData(data);
      }
      this.setLoading(false);
      this.firstDisplay && this.setFirstDisplay(false);
    };
    this.resultSetter = resultSetter;
    const querySetter = e => {
      e?.preventDefault();
      const newQuery = {
        ...this.initQuery,
        ...this.props.query
      };
      if (this.fields[this.sortKey]?.populated) {
        if (newQuery.populate) {
          newQuery.populate = newQuery.populate.map(path => {
            if (typeof path === 'string') {
              if (path == this.sortKey) {
                if (newQuery.$sort) {
                  delete newQuery.$sort;
                }
                return {
                  path,
                  options: {
                    sort: {
                      [this.fields[this.sortKey].populatedSortkey]: this.sortOrder
                    }
                  }
                };
              } else {
                return path;
              }
            }
            return this.sortKey;
          });
        }
      } else {
        newQuery.$sort = {
          [this.sortKey]: this.sortOrder
        };
      }
      const trimmedValue = this.checkInputTransform(this.searchValue?.trim());
      if (trimmedValue && trimmedValue !== '') {
        newQuery[this.searchKey] =
        // if is selected a number and also not searching for exact value
        this.isSelectedANumber() && this.numEqualityValue !== numEquality[0].value ? {
          [`$${this.numEqualityValue}`]: this.checkInputTransform(this.searchValue?.trim())
        } : this.checkInputTransform(this.searchValue?.trim());
      }
      if (objectEquals(this.query, newQuery)) {
        this.setLoading(true);
        this.setReload(!this.reload);
      } else {
        this.setLoading(true);
        this.setQuery(newQuery);
      }
    };
    this.querySetter = querySetter;
    const checkOutputTransform = (field, resultIndex) => {
      const fieldOptions = this.fields && this.fields[field];
      if (fieldOptions?.transform?.out) {
        const transformedValue = fieldOptions.transform.out(this.results[resultIndex]);
        return transformedValue;
      }
      return this.results[resultIndex][fieldOptions?.selectionKey || field];
    };
    this.checkOutputTransform = checkOutputTransform;
    const checkInputTransform = value => {
      const fieldOptions = this.fields && this.fields[this.searchKey];
      if (fieldOptions?.transform?.in) {
        const transformValue = fieldOptions.transform.in(value);
        return transformValue;
      }
      return value;
    };
    this.checkInputTransform = checkInputTransform;
    const isSelectedANumber = () => {
      return this.fields && this.fields[this.searchKey]?.type == Number && !this.fields[this.searchKey]?.virtual;
    };
    this.isSelectedANumber = isSelectedANumber;
    const computeValue = (result, field, index) => {
      const val = this.fields[field]?.type == Boolean ? booleanTransform.out(result) : this.checkOutputTransform(field, index);
      if (this.fields[field]?.virtual) {
        return val;
      } else {
        return this.props.noDoubleClick ? val : Reblend.construct.bind(this)(DoubleClickCopy, {
          noClickOpen: this.props.noClickOpen
        }, val, " ");
      }
    };
    this.computeValue = computeValue;
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
      onChange: e => this.setSortKey(e.target.value.trim()),
      value: this.sortKey
    }, this.fieldKeys.map((field, i) => this.fieldValues[i].hideFromSearch || this.fieldValues[i].virtual ? null : Reblend.construct.bind(this)("option", {
      key: md5(field),
      value: field
    }, this.fieldValues[i].name))))), Reblend.construct.bind(this)(Col, {
      sm: "12",
      md: "6",
      lg: "6",
      className: "pt-1"
    }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(InputGroup.Text, null, "Sort Order"), Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.setSortOrder(e.target.value),
      value: this.sortOrder
    }, sortingOrder.map(obj => Reblend.construct.bind(this)("option", {
      key: md5(obj.name),
      value: obj.value
    }, obj.name)))))))));
    this.sortTip = sortTip;
  }
  initProps(props) {
    this.props = {};
    this.props = props;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, this.props.noControl ? null : Reblend.construct.bind(this)(Form, {
      onSubmit: e => this.querySetter(e)
    }, Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: "12",
      md: "6",
      lg: "6"
    }, Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: this.isSelectedANumber() ? '8' : '12',
      md: this.isSelectedANumber() ? '8' : '12',
      lg: this.isSelectedANumber() ? '8' : '12',
      className: "p-1"
    }, Reblend.construct.bind(this)(InputGroup, null, Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.setSearchKey(e.target.value.trim()),
      value: this.searchKey || this.props.primaryKey || ''
    }, this.fieldKeys.map((field, i) => this.fieldValues[i].hideFromSearch || this.fieldValues[i].virtual ? null : Reblend.construct.bind(this)("option", {
      key: md5(field),
      value: field
    }, this.fieldValues[i].name))), Reblend.construct.bind(this)(InputGroup.Text, null, Reblend.construct.bind(this)(OverlayTrigger, {
      overlay: this.sortTip,
      placement: "auto",
      trigger: 'manual',
      show: this.showSortTip,
      flip: true
    }, Reblend.construct.bind(this)("i", {
      className: "fas fa-sort c-pointer",
      onClick: () => this.setShowSortTip(!this.showSortTip),
      style: this.showSortTip ? {
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
      onClick: () => this.querySetter()
    })))), this.isSelectedANumber() ? Reblend.construct.bind(this)(Col, {
      sm: "4",
      md: "4",
      lg: "4",
      className: "p-1"
    }, Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.setNumEqualityValue(e.target.value.trim()),
      defaultValue: this.numEqualityValue
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
    }, this.fields && this.fields[this.searchKey]?.type == Boolean ? Reblend.construct.bind(this)(Form.Select, {
      onChange: e => this.setSearchValue(e.target.value.trim())
    }, Reblend.construct.bind(this)("option", {
      key: 'false',
      value: 'false'
    }, "False"), Reblend.construct.bind(this)("option", {
      key: 'true',
      value: 'true'
    }, "True")) : Reblend.construct.bind(this)(Form.Control, {
      value: this.searchValue,
      required: true,
      type: this.fields && this.fields[this.searchKey]?.type == Number ? 'number' : this.fields && this.fields[this.searchKey]?.type == Date ? 'date' : 'text',
      onChange: e => this.setSearchValue(e.target.value.trim() == '' ? '' : e.target.value)
    }), Reblend.construct.bind(this)(Button, {
      variant: "primary",
      type: "submit",
      disabled: this.loading,
      style: {
        marginLeft: '-10px',
        borderRadius: '0 5px 5px 0'
      }
    }, Reblend.construct.bind(this)("i", {
      className: "fas fa-search"
    })))))), Reblend.construct.bind(this)(Row, null, Reblend.construct.bind(this)(Col, {
      sm: "12"
    }, this.props.type == 'card' ? Reblend.construct.bind(this)(Spinner, {
      loading: this.loading,
      loadingError: this.loadingError
    }, Reblend.construct.bind(this)("div", {
      className: this.props.cardNotCentered ? 's-start-grid' : 's-grid-justify'
    }, this.results?.map((result, resultIndex) => Reblend.construct.bind(this)(Fragment, {
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
    }, "#") : null, this.fieldValues.map((field, i) =>
    // Header Cell
    Reblend.construct.bind(this)("th", {
      id: `${this.fieldKeys[i] == this.sortKey ? this.sortKey : ''}`,
      onClick: e => !field.virtual && (this.fieldKeys[i] !== this.sortKey ? this.setSortKey(this.fieldKeys[i]) : this.setSortOrder(this.sortOrder == sortingOrder[0].value ? sortingOrder[1].value : sortingOrder[0].value)),
      className: ` c-pointer ${this.fieldKeys[i] !== this.sortKey && !field.virtual ? 'utilityLink' : ''}`,
      style: this.fieldKeys[i] !== this.sortKey ? {} : {
        borderBottom: 'ridge',
        borderBottomColor: 'red',
        color: 'blue'
      },
      key: md5(this.fieldKeys[i])
    }, Reblend.construct.bind(this)("div", {
      className: "d-flex justify-content-center align-items-center p-0"
    }, Reblend.construct.bind(this)("span", {
      style: {
        wordWrap: 'normal'
      }
    }, typeof field.name === 'function' ? field.name() : field.name), "\xA0", this.fieldKeys[i] !== this.sortKey ? null : Reblend.construct.bind(this)("span", null, Reblend.construct.bind(this)("i", {
      className: `fas fa-${this.sortOrder == 1 ? this.fields[this.sortKey].type == Number ? 'sort-numeric-up' : 'sort-alpha-up' : this.fields[this.sortKey].type == Number ? 'sort-numeric-down' : 'sort-alpha-down'} text-red`
    }))))))), Reblend.construct.bind(this)("tbody", {
      style: this.props?.style?.tbodyStyle || {},
      className: `${this.props?.className?.tbodyClass || ''}`
    }, Reblend.construct.bind(this)(Spinner, {
      loading: this.loading,
      loadingError: this.loadingError,
      table: {
        colspan: this.fieldKeys.length
      }
    }, this.results?.map((result, resultIndex) => {
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
        fieldKeys: this.fieldKeys,
        fields: this.fields,
        computeValue: this.computeValue
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
        fieldKeys: this.fieldKeys,
        fields: this.fields,
        computeValue: this.computeValue
      })) : Reblend.construct.bind(this)(TRow, {
        key: result?._id,
        result: result,
        resultIndex: resultIndex,
        style: this.props.style,
        className: this.props.className,
        options: rowOptions,
        numbered: this.props.numbered,
        fieldKeys: this.fieldKeys,
        fields: this.fields,
        computeValue: this.computeValue
      });
    })))))), Reblend.construct.bind(this)(Row, {
      className: "pt-2"
    }, Reblend.construct.bind(this)(Col, {
      sm: "12"
    }, Reblend.construct.bind(this)(Paginator, {
      url: this.props.url,
      dataName: this.props.dataName,
      query: this.query,
      size: this.props.size,
      setResults: this.resultSetter,
      reload: this.reload,
      setLoadingError: this.setLoadingError,
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