interface AnyObject extends Object {
  [propName: string]: any;
}

type JSONValue = string | number | object | boolean | null | any[];
