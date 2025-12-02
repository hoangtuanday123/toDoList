/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Priority */
export enum Priority {
  Low = "low",
  Normal = "normal",
  High = "high",
}

/** Body_login_api_auth_login_post */
export interface BodyLoginApiAuthLoginPost {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /**
   * Password
   * @format password
   */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /**
   * Client Secret
   * @format password
   */
  client_secret?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** Task */
export interface Task {
  /** Id */
  _id?: string | null;
  /** Created At */
  created_at?: Date | null;
  /** Created By */
  created_by?: string | null;
  /** Updated At */
  updated_at?: Date | null;
  /** Updated By */
  updated_by?: string | null;
  /** Deleted At */
  deleted_at?: Date | null;
  /** Deleted By */
  deleted_by?: string | null;
  /** Title */
  title: string;
  /** Description */
  description?: string | null;
  /** Due Date */
  due_date?: Date | null;
  /** @default "normal" */
  priority?: Priority;
  /**
   * Is Completed
   * @default false
   */
  is_completed?: boolean;
}

/** Token */
export interface Token {
  /** Access Token */
  access_token: string;
  /** Token Type */
  token_type: string;
}

/** User */
export interface User {
  /** Id */
  _id?: string | null;
  /** Created At */
  created_at?: Date | null;
  /** Created By */
  created_by?: string | null;
  /** Updated At */
  updated_at?: Date | null;
  /** Updated By */
  updated_by?: string | null;
  /** Deleted At */
  deleted_at?: Date | null;
  /** Deleted By */
  deleted_by?: string | null;
  /** Username */
  username: string;
  /** Hashed Password */
  hashed_password?: string | null;
  /**
   * Is Active
   * @default true
   */
  is_active?: boolean;
  /**
   * Roles
   * @default []
   */
  roles?: string[];
  /**
   * Permissions
   * @default []
   */
  permissions?: string[];
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title TO DO LIST API
 * @version 1.0.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags users
     * @name SetupApiUsersSetupPost
     * @summary Setup
     * @request POST:/api/users/setup
     * @response `200` `any` Successful Response
     */
    setupApiUsersSetupPost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/users/setup`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name LoginApiAuthLoginPost
     * @summary Login
     * @request POST:/api/auth/login
     * @response `200` `Token` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    loginApiAuthLoginPost: (
      data: BodyLoginApiAuthLoginPost,
      params: RequestParams = {},
    ) =>
      this.request<Token, HTTPValidationError>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  };
  tasks = {
    /**
     * No description
     *
     * @tags tasks
     * @name ListTasksApiTasksGet
     * @summary List Tasks
     * @request GET:/api/tasks/
     * @secure
     * @response `200` `(Task)[]` Successful Response
     */
    listTasksApiTasksGet: (params: RequestParams = {}) =>
      this.request<Task[], any>({
        path: `/api/tasks/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tasks
     * @name CreateTaskApiTasksPost
     * @summary Create Task
     * @request POST:/api/tasks/
     * @secure
     * @response `200` `Task` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    createTaskApiTasksPost: (data: Task, params: RequestParams = {}) =>
      this.request<Task, HTTPValidationError>({
        path: `/api/tasks/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tasks
     * @name UpdateTaskApiTasksPatch
     * @summary Update Task
     * @request PATCH:/api/tasks/
     * @secure
     * @response `200` `Task` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    updateTaskApiTasksPatch: (data: Task, params: RequestParams = {}) =>
      this.request<Task, HTTPValidationError>({
        path: `/api/tasks/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tasks
     * @name DeleteTaskApiTasksTaskIdDelete
     * @summary Delete Task
     * @request DELETE:/api/tasks/{task_id}
     * @secure
     * @response `200` `any` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    deleteTaskApiTasksTaskIdDelete: (
      taskId: string,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/tasks/${taskId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tasks
     * @name GetTaskApiTasksTaskIdGet
     * @summary Get Task
     * @request GET:/api/tasks/{task_id}
     * @secure
     * @response `200` `Task` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    getTaskApiTasksTaskIdGet: (taskId: string, params: RequestParams = {}) =>
      this.request<Task, HTTPValidationError>({
        path: `/api/tasks/${taskId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tasks
     * @name SearchTasksApiTasksSearchGet
     * @summary Search Tasks
     * @request GET:/api/tasks/search
     * @secure
     * @response `200` `(Task)[]` Successful Response
     * @response `422` `HTTPValidationError` Validation Error
     */
    searchTasksApiTasksSearchGet: (
      query: {
        /** Q */
        q: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Task[], HTTPValidationError>({
        path: `/api/tasks/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  currentUser = {
    /**
     * No description
     *
     * @tags current_user
     * @name GetCurrentUserInfoApiCurrentUserGet
     * @summary Get Current User Info
     * @request GET:/api/current_user/
     * @secure
     * @response `200` `User` Successful Response
     */
    getCurrentUserInfoApiCurrentUserGet: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/current_user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
