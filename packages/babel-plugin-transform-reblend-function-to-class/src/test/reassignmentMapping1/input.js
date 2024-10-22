import { Row, Col, InputGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Reblend, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useMemo,
} from "reblendjs";
import fetcher from "../../utils/SharedFetcher";
import Spinner from "../general/Spinner";
import { FormEvent } from "react";
import { BaseComponent } from "reblendjs/dist/internal/BaseComponent";

function HistoryComponentsForm(
  {
    fields,
    updates = {},
    url,
    setChange,
    setReload = () => {},
  },
  thisComponent
) {
  const dataIdRef = useRef("");

  const [isUpdate, setIsUpdate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const ignore = ["_id", "__v", "status", "createdAt", "updatedAt"];
    const _fields= [];

    const getType = (type) => {
      const dictionary = new Map();
      dictionary.set(String, "text");
      dictionary.set(Number, "number");
      dictionary.set(Boolean, "radio");
      return dictionary.get(type);
    };

    for (const [key, value] of Object.entries(fields || {})) {
      if (!ignore.find((ign) => key.includes(ign)) && !value.virtual) {
        _fields.push({ key, type: getType(value.type) });
      }
    }

    _fields.push({ key: "status", type: "text" });

    setKeys(_fields);
  }, [fields]);

  let data = updates;

  useEffect(() => {
    data = updates
    if (data) {
      //@ts-ignore
      dataIdRef.current = data._id;
      setIsUpdate(true);
    } else {
      data = {};
      keys?.forEach((key) => {
        const type = fields[key.key].type;
        let value = "";
        switch (type) {
          case Boolean:
            value = false;
            break;
          case Number:
            value = 0;
            break;
        }
        data[key.key] = value;
      });
    }
  }, [updates]);

  const createUser = (e) => {
    setSubmitting(true);
    e.preventDefault();

    const gdFetchOption = {
      url,
      data,
    };
    fetcher
      .fetch(gdFetchOption)
      .then((response) => {
        if (response) {
          if (!response.data.status) {
            toast.error(response.data.message);
          } else {
            setPropsData && setPropsData(response.data.created);
            setReload && setReload();
            toast.success(response.data.message);
          }
        }
        setSubmitting(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setSubmitting(false);
      });
  };

  const updateUser = (e) => {
    setSubmitting(true);
    e.preventDefault();
    const gdFetchOption = {
      url,
      method: "PATCH",
      data: {
        id: dataIdRef.current,
        ...data,
      },
    };
    fetcher
      .fetch(gdFetchOption)
      .then((response) => {
        if (response) {
          if (!response.data.status) {
            toast.error(response.data.message);
          } else {
            setPropsData && setPropsData(response.data.created);
            setReload && setReload();
            toast.success(response.data.message);
          }
        }
        setSubmitting(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setSubmitting(false);
      });
  };

  const [changeData, setChangeData] = useState(
    null
  );

  const tracker = useMemo(() => {
    if (changeData) {
      data[changeData.key] = changeData.value;
    }
    return !tracker;
  }, [changeData]);

  return (
    data && (
      <Form onSubmit={(e) => (isUpdate ? updateUser(e) : createUser(e))}>
        <Row>
          {keys?.map(({ key, type }) => {
            return key === "status" ? (
              <Col xs="12" lg="6" className="p-1">
                <InputGroup>
                  <InputGroup.Text
                    className="fw-bold"
                    style={{ textTransform: "capitalize" }}
                  >
                    {key} &nbsp;&nbsp;
                    <Form.Switch
                      checked={!!data[key]}
                      onChange={() =>
                        setChangeData({ key, value: data[key] > 0 ? 0 : 1 })
                      }
                    ></Form.Switch>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            ) : (
              <Col xs="12" className="p-1">
                <InputGroup>
                  <InputGroup.Text
                    className="fw-bold"
                    style={{ textTransform: "capitalize" }}
                  >
                    {key}
                  </InputGroup.Text>
                  <Form.Control
                    type={type}
                    value={data[key]}
                    onChange={(e) => setChangeData({ key, value: e.target.value })}
                  />
                </InputGroup>
              </Col>
            );
          })}

          <Col xs="12" className="p-1">
            <Spinner
              loading={submitting}
              loadingText={`${isUpdate ? "Updating user" : "Creating user"}`}
            >
              <Form.Control
                size="sm"
                type="submit"
                value={`${isUpdate ? "Update" : "Create"}`}
                className="fw-bold utilityLink"
              />
            </Spinner>
          </Col>
        </Row>
      </Form>
    )
  );
}
export default HistoryComponentsForm;
