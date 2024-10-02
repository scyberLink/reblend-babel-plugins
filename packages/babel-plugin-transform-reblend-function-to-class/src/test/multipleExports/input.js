/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable multiline-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable require-jsdoc */
import Reblend, { Fragment, useEffect, useRef, useState } from 'reblendjs'
import {
  Row,
  Col,
  Table,
  Form,
  Button,
  Tooltip,
  OverlayTrigger,
  InputGroup,
  Spinner as RSpinner,
  Card,
} from 'react-bootstrap'
import SharedConfig from '../../scripts/SharedConfig'
import { ACTIVE, INACTIVE, PENDING_APPROVAL, SUSPENDED, UID } from '../../scripts/config/contants'
import Paginator from './Paginator'
import md5 from '../../scripts/md5'
import { objectEquals } from '../../scripts/misc'
import DoubleClickCopy from './DoubleClickCopy'
import Spinner from './Spinner'
import TRow from './TRow'
import HumanizeTimestamp from '../general/HumanizeTimestamp'

export const dateTransform = {
  out: (rowData, type = 'createdAt') => {
    const timestamp = rowData[type]
    return timestamp?.date || timestamp?.time ? (
      <HumanizeTimestamp timestamp={timestamp.date || timestamp.time} />
    ) : null
  },
}

export const statusTransform = {
  out: (rowData) => {
    const statusCode = rowData.status
    return statusCode == ACTIVE ? (
      <b className="text-success">Success</b>
    ) : statusCode == SUSPENDED ? (
      <b className="text-danger">Suspended</b>
    ) : statusCode == PENDING_APPROVAL ? (
      <b className="text-warning">
        Pending <RSpinner animation="grow" variant="danger" size="sm" />
      </b>
    ) : (
      <b className="text-danger">Failed</b>
    )
  },
  in: (statusString) => {
    const sst = statusString.toLowerCase()
    return sst.includes('success')
      ? ACTIVE
      : sst.includes('suspend')
        ? SUSPENDED
        : sst.includes('pending')
          ? PENDING_APPROVAL
          : INACTIVE
  },
}

export const booleanTransform = {
  out: (status) => {
    return status ? <b className="text-primary">True</b> : <b className="text-black">False</b>
  },
  in: (statusString) => {
    const sst = statusString.toLowerCase()
    return sst == 'true'
  },
}

const numEquality = [
  {
    name: 'Equal',
    value: 'e',
  },
  {
    name: 'Greater OR Equal',
    value: 'gte',
  },
  {
    name: 'Lesser OR Equal',
    value: 'lte',
  },
]
export const ASCENDING = 1
export const DESCENDING = -1

const sortingOrder = [
  {
    name: 'Ascending',
    value: ASCENDING,
  },
  {
    name: 'Descending',
    value: DESCENDING,
  },
]

function PaginatedTable(props) {
  const [reload, setReload] = useState(false)
  const [fields, setFields] = useState(null)
  const [fieldKeys, setFieldKeys] = useState([])
  const [fieldValues, setFieldValues] = useState([])
  const [initQuery, setInitQuery] = useState(null)
  const [query, setQuery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [searchKey, setSearchKey] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [showSortTip, setShowSortTip] = useState(false)
  const [firstDisplay, setFirstDisplay] = useState(true)
  const [loadingError, setLoadingError] = useState(false)
  const [numEqualityValue, setNumEqualityValue] = useState(numEquality[0].value)
  const uidRef = useRef(SharedConfig.getLocalData(UID))

  useEffect(() => {
    if (!props.noScroll) {
      sortKey &&
        document.getElementById(sortKey)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
    }
  }, [results])

  useEffect(() => {
    !firstDisplay && setReload(!reload)
  }, [props.reload])

  useEffect(() => {
    setSearchValue('')
  }, [searchKey])

  useEffect(() => {
    !firstDisplay && querySetter()
  }, [sortKey, sortOrder])

  useEffect(() => {
    !firstDisplay && querySetter()
  }, [props.query])

  useEffect(() => {
    const f = { ...props.fields }
    f.status && !f.status.transform && (f.status.transform = statusTransform)
    f.createdAt &&
      !f.createdAt.transform &&
      (f.createdAt.transform = {
        out: (rowData) => dateTransform.out(rowData),
      })
    f.updatedAt &&
      !f.updatedAt.transform &&
      (f.updatedAt.transform = {
        out: (rowData) => dateTransform.out(rowData, 'updatedAt'),
      })

    f['createdAt.date'] &&
      !f['createdAt.date'].transform &&
      (f['createdAt.date'].transform = {
        out: (rowData) => dateTransform.out(rowData),
      })
    f['updatedAt.date'] &&
      !f['updatedAt.date'].transform &&
      (f['updatedAt.date'].transform = {
        out: (rowData) => dateTransform.out(rowData, 'updatedAt'),
      })

    f['createdAt.time'] &&
      !f['createdAt.time'].transform &&
      (f['createdAt.time'].transform = {
        out: (rowData) => dateTransform.out(rowData),
      })
    f['updatedAt.time'] &&
      !f['updatedAt.time'].transform &&
      (f['updatedAt.time'].transform = {
        out: (rowData) => dateTransform.out(rowData, 'updatedAt'),
      })

    for (const fieldKey in f) {
      if (Object.hasOwnProperty.call(f, fieldKey)) {
        const fieldOptions = f[fieldKey]
        if (fieldOptions.type == Boolean && !fieldOptions?.transform?.out) {
          fieldOptions.transform = { out: booleanTransform.out }
        }
      }
    }

    const keys = Object.keys(f)
    const values = Object.values(f)
    const defaultSearchKey = props.primaryKey ? props.primaryKey : keys[0] || null
    const defaultSortOrder = props.sortOrder || ASCENDING
    const defaultInitQuery = props.forCurrentUser ? { ...{ uid: uidRef.current }, ...props.query } : props.query

    const newQuery = {
      ...defaultInitQuery,
    }

    if (f[defaultSearchKey]?.populated) {
      if (newQuery.populate) {
        newQuery.populate = newQuery.populate.map((path) => {
          if (typeof path === 'string') {
            if (path == defaultSearchKey) {
              if (newQuery.$sort) {
                delete newQuery.$sort
              }
              return {
                path,
                options: {
                  sort: {
                    [f[defaultSearchKey].populatedSortkey]: defaultSortOrder,
                  },
                },
              }
            } else {
              return path
            }
          }
          return defaultSearchKey
        })
      }
    } else {
      newQuery.$sort = {
        [defaultSearchKey]: defaultSortOrder,
      }
    }

    setFields(f)
    setFieldKeys(keys)
    setFieldValues(values)
    setSearchKey(defaultSearchKey)
    setSortKey(defaultSearchKey)
    setSortOrder(defaultSortOrder)
    setInitQuery(newQuery)
    setQuery(newQuery)
  }, [props.fields, props.query])

  function resultSetter(data) {
    if (data) {
      setResults(data)
      props.setData && props.setData(data)
    }
    setLoading(false)
    firstDisplay && setFirstDisplay(false)
  }

  function querySetter(e) {
    e?.preventDefault()
    const newQuery = {
      ...initQuery,
      ...props.query,
    }

    if (fields[sortKey]?.populated) {
      if (newQuery.populate) {
        newQuery.populate = newQuery.populate.map((path) => {
          if (typeof path === 'string') {
            if (path == sortKey) {
              if (newQuery.$sort) {
                delete newQuery.$sort
              }
              return {
                path,
                options: {
                  sort: {
                    [fields[sortKey].populatedSortkey]: sortOrder,
                  },
                },
              }
            } else {
              return path
            }
          }
          return sortKey
        })
      }
    } else {
      newQuery.$sort = {
        [sortKey]: sortOrder,
      }
    }
    const trimmedValue = checkInputTransform(searchValue?.trim())

    if (trimmedValue && trimmedValue !== '') {
      newQuery[searchKey] =
        // if is selected a number and also not searching for exact value
        isSelectedANumber() && numEqualityValue !== numEquality[0].value
          ? {
              [`$${numEqualityValue}`]: checkInputTransform(searchValue?.trim()),
            }
          : checkInputTransform(searchValue?.trim())
    }

    if (objectEquals(query, newQuery)) {
      setLoading(true)
      setReload(!reload)
    } else {
      setLoading(true)
      setQuery(newQuery)
    }
  }

  function checkOutputTransform(field, resultIndex) {
    const fieldOptions = fields && fields[field]
    if (fieldOptions?.transform?.out) {
      const transformedValue = fieldOptions.transform.out(results[resultIndex])
      return transformedValue
    }
    return results[resultIndex][fieldOptions?.selectionKey || field]
  }

  function checkInputTransform(value) {
    const fieldOptions = fields && fields[searchKey]
    if (fieldOptions?.transform?.in) {
      const transformValue = fieldOptions.transform.in(value)
      return transformValue
    }
    return value
  }

  function isSelectedANumber() {
    return fields && fields[searchKey]?.type == Number && !fields[searchKey]?.virtual
  }

  function computeValue(result, field, index) {
    const val = fields[field]?.type == Boolean ? booleanTransform.out(result) : checkOutputTransform(field, index)
    if (fields[field]?.virtual) {
      return val
    } else {
      return props.noDoubleClick ? val : <DoubleClickCopy noClickOpen={props.noClickOpen}>{val} </DoubleClickCopy>
    }
  }

  const sortTip = (
    <Tooltip id="custom-tooltip">
      <Card>
        <div className="text-primary h4 pt-1 pb-0">Sorting</div>
        <Card.Body className="p-1">
          <Row>
            <Col sm="12" md="6" lg="6" className="pt-1">
              <InputGroup>
                <InputGroup.Text>Sort By</InputGroup.Text>
                <Form.Select onChange={(e) => setSortKey(e.target.value.trim())} value={sortKey}>
                  {fieldKeys.map((field, i) =>
                    fieldValues[i].hideFromSearch || fieldValues[i].virtual ? null : (
                      <option key={md5(field)} value={field}>
                        {fieldValues[i].name}
                      </option>
                    ),
                  )}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col sm="12" md="6" lg="6" className="pt-1">
              <InputGroup>
                <InputGroup.Text>Sort Order</InputGroup.Text>
                <Form.Select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                  {sortingOrder.map((obj) => (
                    <option key={md5(obj.name)} value={obj.value}>
                      {obj.name}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Tooltip>
  )

  return (
    <div>
      {props.noControl ? null : (
        <Form onSubmit={(e) => querySetter(e)}>
          <Row>
            <Col sm="12" md="6" lg="6">
              <Row>
                <Col
                  sm={isSelectedANumber() ? '8' : '12'}
                  md={isSelectedANumber() ? '8' : '12'}
                  lg={isSelectedANumber() ? '8' : '12'}
                  className="p-1"
                >
                  <InputGroup>
                    <Form.Select
                      onChange={(e) => setSearchKey(e.target.value.trim())}
                      value={searchKey || props.primaryKey || ''}
                    >
                      {fieldKeys.map((field, i) =>
                        fieldValues[i].hideFromSearch || fieldValues[i].virtual ? null : (
                          <option key={md5(field)} value={field}>
                            {fieldValues[i].name}
                          </option>
                        ),
                      )}
                    </Form.Select>
                    <InputGroup.Text>
                      <OverlayTrigger overlay={sortTip} placement="auto" trigger={'manual'} show={showSortTip} flip>
                        <i
                          className="fas fa-sort c-pointer"
                          onClick={() => setShowSortTip(!showSortTip)}
                          style={
                            showSortTip
                              ? {
                                  backgroundColor: 'blue',
                                  borderRadius: '10px',
                                  padding: '4px',
                                }
                              : {}
                          }
                        ></i>
                      </OverlayTrigger>
                      <style>
                        {`
                      .tooltip-inner {
                        max-width: 100vw;
                        /* background-color: transparent */
                      }`}
                      </style>
                    </InputGroup.Text>
                    <InputGroup.Text>
                      <i className="fas fa-refresh c-pointer" onClick={() => querySetter()}></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                {isSelectedANumber() ? (
                  <Col sm="4" md="4" lg="4" className="p-1">
                    <Form.Select
                      onChange={(e) => setNumEqualityValue(e.target.value.trim())}
                      defaultValue={numEqualityValue}
                    >
                      {numEquality.map((obj) => (
                        <option key={md5(obj.value)} value={obj.value}>
                          {obj.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                ) : null}
              </Row>
            </Col>

            <Col sm="12" md="6" lg="6" className="p-1">
              <div className="form-group d-flex">
                {fields && fields[searchKey]?.type == Boolean ? (
                  <Form.Select onChange={(e) => setSearchValue(e.target.value.trim())}>
                    <option key={'false'} value={'false'}>
                      False
                    </option>
                    <option key={'true'} value={'true'}>
                      True
                    </option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    value={searchValue}
                    required={true}
                    type={
                      fields && fields[searchKey]?.type == Number
                        ? 'number'
                        : fields && fields[searchKey]?.type == Date
                          ? 'date'
                          : 'text'
                    }
                    onChange={(e) => setSearchValue(e.target.value.trim() == '' ? '' : e.target.value)}
                  />
                )}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  style={{ marginLeft: '-10px', borderRadius: '0 5px 5px 0' }}
                >
                  <i className="fas fa-search"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}

      <Row>
        <Col sm="12">
          {props.type == 'card' ? (
            <Spinner loading={loading} loadingError={loadingError}>
              <div className={props.cardNotCentered ? 's-start-grid' : 's-grid-justify'}>
                {results?.map((result, resultIndex) => (
                  <Fragment key={result?._id}>{props?.cardView(result, resultIndex)}</Fragment>
                ))}
              </div>
            </Spinner>
          ) : (
            <Table
              responsive
              striped
              hover
              style={props?.style?.tableStyle ? props.style.tableStyle : props.style}
              className={`${
                props?.className?.tableClass
                  ? props?.className?.tableClass
                  : typeof props?.className === 'string'
                    ? props?.className
                    : ''
              }`}
            >
              <thead style={props?.style?.theadStyle || {}} className={`${props?.className?.theadClass || ''}`}>
                {/* Header row */}
                <tr>
                  {props.numbered ? <th key="#">#</th> : null}
                  {fieldValues.map((field, i) => (
                    // Header Cell
                    <th
                      id={`${fieldKeys[i] == sortKey ? sortKey : ''}`}
                      onClick={(e) =>
                        !field.virtual &&
                        (fieldKeys[i] !== sortKey
                          ? setSortKey(fieldKeys[i])
                          : setSortOrder(
                              sortOrder == sortingOrder[0].value ? sortingOrder[1].value : sortingOrder[0].value,
                            ))
                      }
                      className={` c-pointer ${fieldKeys[i] !== sortKey && !field.virtual ? 'utilityLink' : ''}`}
                      style={
                        fieldKeys[i] !== sortKey
                          ? {}
                          : {
                              borderBottom: 'ridge',
                              borderBottomColor: 'red',
                              color: 'blue',
                            }
                      }
                      key={md5(fieldKeys[i])}
                    >
                      {/* Header Data */}
                      <div className="d-flex justify-content-center align-items-center p-0">
                        <span style={{ wordWrap: 'normal' }}>
                          {typeof field.name === 'function' ? field.name() : field.name}
                        </span>
                        &nbsp;
                        {fieldKeys[i] !== sortKey ? null : (
                          <span>
                            <i
                              className={`fas fa-${
                                sortOrder == 1
                                  ? fields[sortKey].type == Number
                                    ? 'sort-numeric-up'
                                    : 'sort-alpha-up'
                                  : fields[sortKey].type == Number
                                    ? 'sort-numeric-down'
                                    : 'sort-alpha-down'
                              } text-red`}
                            ></i>
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={props?.style?.tbodyStyle || {}} className={`${props?.className?.tbodyClass || ''}`}>
                <Spinner loading={loading} loadingError={loadingError} table={{ colspan: fieldKeys.length }}>
                  {results?.map((result, resultIndex) => {
                    // Row
                    const rowOptions =
                      typeof props?.rowOptions === 'function' ? props.rowOptions(result) : props.rowOptions
                    const t = rowOptions?.title
                    delete rowOptions?.title
                    return rowOptions && rowOptions.noTitleToolTip ? (
                      <TRow
                        key={result?._id}
                        result={result}
                        resultIndex={resultIndex}
                        style={props.style}
                        className={props.className}
                        options={rowOptions}
                        numbered={props.numbered}
                        fieldKeys={fieldKeys}
                        fields={fields}
                        computeValue={computeValue}
                      />
                    ) : t ? (
                      <OverlayTrigger
                        key={result?._id}
                        delay={{ show: 500, hide: 0 }}
                        overlay={<Tooltip id="tooltip">{t}</Tooltip>}
                        placement="auto"
                      >
                        <TRow
                          result={result}
                          resultIndex={resultIndex}
                          style={props.style}
                          className={props.className}
                          options={rowOptions}
                          numbered={props.numbered}
                          fieldKeys={fieldKeys}
                          fields={fields}
                          computeValue={computeValue}
                        />
                      </OverlayTrigger>
                    ) : (
                      <TRow
                        key={result?._id}
                        result={result}
                        resultIndex={resultIndex}
                        style={props.style}
                        className={props.className}
                        options={rowOptions}
                        numbered={props.numbered}
                        fieldKeys={fieldKeys}
                        fields={fields}
                        computeValue={computeValue}
                      />
                    )
                  })}
                </Spinner>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col sm="12">
          <Paginator
            url={props.url}
            dataName={props.dataName}
            query={query}
            size={props.size}
            setResults={resultSetter}
            reload={reload}
            setLoadingError={setLoadingError}
            hidden={props.hidePaginator}
            noPaginator={props.noPaginator}
          />
        </Col>
      </Row>
    </div>
  )
}

PaginatedTable.defaultProps = {
  numbered: true,
  forCurrentUser: true,
  // noControl: true, #if it does not support searching but can sort
}

export default PaginatedTable
