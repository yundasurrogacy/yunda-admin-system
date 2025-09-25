export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  bigint: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** 申请表 */
export type Applications = {
  __typename?: 'applications';
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data: Scalars['jsonb']['output'];
  /** 类型可选：1.intended_parent 2. surrogate_mother */
  application_type: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 状态可选：1.pending 2.approved 3.rejected, */
  status: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 申请表 */
export type ApplicationsApplication_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "applications" */
export type Applications_Aggregate = {
  __typename?: 'applications_aggregate';
  aggregate?: Maybe<Applications_Aggregate_Fields>;
  nodes: Array<Applications>;
};

/** aggregate fields of "applications" */
export type Applications_Aggregate_Fields = {
  __typename?: 'applications_aggregate_fields';
  avg?: Maybe<Applications_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Applications_Max_Fields>;
  min?: Maybe<Applications_Min_Fields>;
  stddev?: Maybe<Applications_Stddev_Fields>;
  stddev_pop?: Maybe<Applications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Applications_Stddev_Samp_Fields>;
  sum?: Maybe<Applications_Sum_Fields>;
  var_pop?: Maybe<Applications_Var_Pop_Fields>;
  var_samp?: Maybe<Applications_Var_Samp_Fields>;
  variance?: Maybe<Applications_Variance_Fields>;
};


/** aggregate fields of "applications" */
export type Applications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Applications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Applications_Append_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Applications_Avg_Fields = {
  __typename?: 'applications_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "applications". All fields are combined with a logical 'AND'. */
export type Applications_Bool_Exp = {
  _and?: InputMaybe<Array<Applications_Bool_Exp>>;
  _not?: InputMaybe<Applications_Bool_Exp>;
  _or?: InputMaybe<Array<Applications_Bool_Exp>>;
  application_data?: InputMaybe<Jsonb_Comparison_Exp>;
  application_type?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "applications" */
export enum Applications_Constraint {
  /** unique or primary key constraint on columns "id" */
  ApplicationsPkey = 'applications_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Applications_Delete_At_Path_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Applications_Delete_Elem_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Applications_Delete_Key_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "applications" */
export type Applications_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "applications" */
export type Applications_Insert_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['jsonb']['input']>;
  /** 类型可选：1.intended_parent 2. surrogate_mother */
  application_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 状态可选：1.pending 2.approved 3.rejected, */
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Applications_Max_Fields = {
  __typename?: 'applications_max_fields';
  /** 类型可选：1.intended_parent 2. surrogate_mother */
  application_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 状态可选：1.pending 2.approved 3.rejected, */
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Applications_Min_Fields = {
  __typename?: 'applications_min_fields';
  /** 类型可选：1.intended_parent 2. surrogate_mother */
  application_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 状态可选：1.pending 2.approved 3.rejected, */
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "applications" */
export type Applications_Mutation_Response = {
  __typename?: 'applications_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Applications>;
};

/** on_conflict condition type for table "applications" */
export type Applications_On_Conflict = {
  constraint: Applications_Constraint;
  update_columns?: Array<Applications_Update_Column>;
  where?: InputMaybe<Applications_Bool_Exp>;
};

/** Ordering options when selecting data from "applications". */
export type Applications_Order_By = {
  application_data?: InputMaybe<Order_By>;
  application_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: applications */
export type Applications_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Applications_Prepend_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "applications" */
export enum Applications_Select_Column {
  /** column name */
  ApplicationData = 'application_data',
  /** column name */
  ApplicationType = 'application_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "applications" */
export type Applications_Set_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['jsonb']['input']>;
  /** 类型可选：1.intended_parent 2. surrogate_mother */
  application_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 状态可选：1.pending 2.approved 3.rejected, */
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Applications_Stddev_Fields = {
  __typename?: 'applications_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Applications_Stddev_Pop_Fields = {
  __typename?: 'applications_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Applications_Stddev_Samp_Fields = {
  __typename?: 'applications_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "applications" */
export type Applications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Applications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Applications_Stream_Cursor_Value_Input = {
  /** 数据结构和surrogate_mother或者intended_parents数据表结构一致 */
  application_data?: InputMaybe<Scalars['jsonb']['input']>;
  /** 类型可选：1.intended_parent 2. surrogate_mother */
  application_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 状态可选：1.pending 2.approved 3.rejected, */
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Applications_Sum_Fields = {
  __typename?: 'applications_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "applications" */
export enum Applications_Update_Column {
  /** column name */
  ApplicationData = 'application_data',
  /** column name */
  ApplicationType = 'application_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Applications_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Applications_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Applications_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Applications_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Applications_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Applications_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Applications_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Applications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Applications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Applications_Var_Pop_Fields = {
  __typename?: 'applications_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Applications_Var_Samp_Fields = {
  __typename?: 'applications_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Applications_Variance_Fields = {
  __typename?: 'applications_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "cases" */
export type Cases = {
  __typename?: 'cases';
  /** An array relationship */
  cases_files: Array<Cases_Files>;
  /** An aggregate relationship */
  cases_files_aggregate: Cases_Files_Aggregate;
  /** An object relationship */
  client_manager?: Maybe<Client_Managers>;
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['bigint']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  intended_parent?: Maybe<Intended_Parents>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** An array relationship */
  ivf_clinics: Array<Ivf_Clinics>;
  /** An aggregate relationship */
  ivf_clinics_aggregate: Ivf_Clinics_Aggregate;
  /** An array relationship */
  posts: Array<Posts>;
  /** An aggregate relationship */
  posts_aggregate: Posts_Aggregate;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  surrogate_mother?: Maybe<Surrogate_Mothers>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance: Scalars['numeric']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "cases" */
export type CasesCases_FilesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


/** columns and relationships of "cases" */
export type CasesCases_Files_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


/** columns and relationships of "cases" */
export type CasesIvf_ClinicsArgs = {
  distinct_on?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ivf_Clinics_Order_By>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


/** columns and relationships of "cases" */
export type CasesIvf_Clinics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ivf_Clinics_Order_By>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


/** columns and relationships of "cases" */
export type CasesPostsArgs = {
  distinct_on?: InputMaybe<Array<Posts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Posts_Order_By>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};


/** columns and relationships of "cases" */
export type CasesPosts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Posts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Posts_Order_By>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};

/** aggregated selection of "cases" */
export type Cases_Aggregate = {
  __typename?: 'cases_aggregate';
  aggregate?: Maybe<Cases_Aggregate_Fields>;
  nodes: Array<Cases>;
};

export type Cases_Aggregate_Bool_Exp = {
  count?: InputMaybe<Cases_Aggregate_Bool_Exp_Count>;
};

export type Cases_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Cases_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Cases_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "cases" */
export type Cases_Aggregate_Fields = {
  __typename?: 'cases_aggregate_fields';
  avg?: Maybe<Cases_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cases_Max_Fields>;
  min?: Maybe<Cases_Min_Fields>;
  stddev?: Maybe<Cases_Stddev_Fields>;
  stddev_pop?: Maybe<Cases_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cases_Stddev_Samp_Fields>;
  sum?: Maybe<Cases_Sum_Fields>;
  var_pop?: Maybe<Cases_Var_Pop_Fields>;
  var_samp?: Maybe<Cases_Var_Samp_Fields>;
  variance?: Maybe<Cases_Variance_Fields>;
};


/** aggregate fields of "cases" */
export type Cases_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cases_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "cases" */
export type Cases_Aggregate_Order_By = {
  avg?: InputMaybe<Cases_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cases_Max_Order_By>;
  min?: InputMaybe<Cases_Min_Order_By>;
  stddev?: InputMaybe<Cases_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cases_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cases_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cases_Sum_Order_By>;
  var_pop?: InputMaybe<Cases_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cases_Var_Samp_Order_By>;
  variance?: InputMaybe<Cases_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "cases" */
export type Cases_Arr_Rel_Insert_Input = {
  data: Array<Cases_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cases_On_Conflict>;
};

/** aggregate avg on columns */
export type Cases_Avg_Fields = {
  __typename?: 'cases_avg_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "cases" */
export type Cases_Avg_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cases". All fields are combined with a logical 'AND'. */
export type Cases_Bool_Exp = {
  _and?: InputMaybe<Array<Cases_Bool_Exp>>;
  _not?: InputMaybe<Cases_Bool_Exp>;
  _or?: InputMaybe<Array<Cases_Bool_Exp>>;
  cases_files?: InputMaybe<Cases_Files_Bool_Exp>;
  cases_files_aggregate?: InputMaybe<Cases_Files_Aggregate_Bool_Exp>;
  client_manager?: InputMaybe<Client_Managers_Bool_Exp>;
  client_manager_client_managers?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  intended_parent?: InputMaybe<Intended_Parents_Bool_Exp>;
  intended_parent_intended_parents?: InputMaybe<Bigint_Comparison_Exp>;
  ivf_clinics?: InputMaybe<Ivf_Clinics_Bool_Exp>;
  ivf_clinics_aggregate?: InputMaybe<Ivf_Clinics_Aggregate_Bool_Exp>;
  posts?: InputMaybe<Posts_Bool_Exp>;
  posts_aggregate?: InputMaybe<Posts_Aggregate_Bool_Exp>;
  process_status?: InputMaybe<String_Comparison_Exp>;
  surrogate_mother?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
  surrogate_mother_surrogate_mothers?: InputMaybe<Bigint_Comparison_Exp>;
  trust_account_balance?: InputMaybe<Numeric_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cases" */
export enum Cases_Constraint {
  /** unique or primary key constraint on columns "id" */
  CasesPkey = 'cases_pkey',
  /** unique or primary key constraint on columns "intended_parent_intended_parents", "surrogate_mother_surrogate_mothers" */
  CasesSurrogateMotherSurrogateMothersIntendedParentIntend = 'cases_surrogate_mother_surrogate_mothers_intended_parent_intend'
}

/** 案子的相关文件 */
export type Cases_Files = {
  __typename?: 'cases_files';
  /** An object relationship */
  case?: Maybe<Cases>;
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** 文件类型 */
  file_type?: Maybe<Scalars['String']['output']>;
  /** 文件地址 */
  file_url?: Maybe<Scalars['String']['output']>;
  id: Scalars['bigint']['output'];
  /** An object relationship */
  journey?: Maybe<Journeys>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['bigint']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "cases_files" */
export type Cases_Files_Aggregate = {
  __typename?: 'cases_files_aggregate';
  aggregate?: Maybe<Cases_Files_Aggregate_Fields>;
  nodes: Array<Cases_Files>;
};

export type Cases_Files_Aggregate_Bool_Exp = {
  count?: InputMaybe<Cases_Files_Aggregate_Bool_Exp_Count>;
};

export type Cases_Files_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Cases_Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Cases_Files_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "cases_files" */
export type Cases_Files_Aggregate_Fields = {
  __typename?: 'cases_files_aggregate_fields';
  avg?: Maybe<Cases_Files_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cases_Files_Max_Fields>;
  min?: Maybe<Cases_Files_Min_Fields>;
  stddev?: Maybe<Cases_Files_Stddev_Fields>;
  stddev_pop?: Maybe<Cases_Files_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cases_Files_Stddev_Samp_Fields>;
  sum?: Maybe<Cases_Files_Sum_Fields>;
  var_pop?: Maybe<Cases_Files_Var_Pop_Fields>;
  var_samp?: Maybe<Cases_Files_Var_Samp_Fields>;
  variance?: Maybe<Cases_Files_Variance_Fields>;
};


/** aggregate fields of "cases_files" */
export type Cases_Files_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cases_Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "cases_files" */
export type Cases_Files_Aggregate_Order_By = {
  avg?: InputMaybe<Cases_Files_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cases_Files_Max_Order_By>;
  min?: InputMaybe<Cases_Files_Min_Order_By>;
  stddev?: InputMaybe<Cases_Files_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cases_Files_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cases_Files_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cases_Files_Sum_Order_By>;
  var_pop?: InputMaybe<Cases_Files_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cases_Files_Var_Samp_Order_By>;
  variance?: InputMaybe<Cases_Files_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "cases_files" */
export type Cases_Files_Arr_Rel_Insert_Input = {
  data: Array<Cases_Files_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cases_Files_On_Conflict>;
};

/** aggregate avg on columns */
export type Cases_Files_Avg_Fields = {
  __typename?: 'cases_files_avg_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "cases_files" */
export type Cases_Files_Avg_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cases_files". All fields are combined with a logical 'AND'. */
export type Cases_Files_Bool_Exp = {
  _and?: InputMaybe<Array<Cases_Files_Bool_Exp>>;
  _not?: InputMaybe<Cases_Files_Bool_Exp>;
  _or?: InputMaybe<Array<Cases_Files_Bool_Exp>>;
  case?: InputMaybe<Cases_Bool_Exp>;
  case_cases?: InputMaybe<Bigint_Comparison_Exp>;
  category?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  file_type?: InputMaybe<String_Comparison_Exp>;
  file_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  journey?: InputMaybe<Journeys_Bool_Exp>;
  journey_journeys?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cases_files" */
export enum Cases_Files_Constraint {
  /** unique or primary key constraint on columns "id" */
  CasesFilesPkey = 'cases_files_pkey'
}

/** input type for incrementing numeric columns in table "cases_files" */
export type Cases_Files_Inc_Input = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "cases_files" */
export type Cases_Files_Insert_Input = {
  case?: InputMaybe<Cases_Obj_Rel_Insert_Input>;
  /** 外键，关联cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 文件类型 */
  file_type?: InputMaybe<Scalars['String']['input']>;
  /** 文件地址 */
  file_url?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  journey?: InputMaybe<Journeys_Obj_Rel_Insert_Input>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cases_Files_Max_Fields = {
  __typename?: 'cases_files_max_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 文件类型 */
  file_type?: Maybe<Scalars['String']['output']>;
  /** 文件地址 */
  file_url?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "cases_files" */
export type Cases_Files_Max_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 文件类型 */
  file_type?: InputMaybe<Order_By>;
  /** 文件地址 */
  file_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cases_Files_Min_Fields = {
  __typename?: 'cases_files_min_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 文件类型 */
  file_type?: Maybe<Scalars['String']['output']>;
  /** 文件地址 */
  file_url?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "cases_files" */
export type Cases_Files_Min_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 文件类型 */
  file_type?: InputMaybe<Order_By>;
  /** 文件地址 */
  file_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cases_files" */
export type Cases_Files_Mutation_Response = {
  __typename?: 'cases_files_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cases_Files>;
};

/** on_conflict condition type for table "cases_files" */
export type Cases_Files_On_Conflict = {
  constraint: Cases_Files_Constraint;
  update_columns?: Array<Cases_Files_Update_Column>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};

/** Ordering options when selecting data from "cases_files". */
export type Cases_Files_Order_By = {
  case?: InputMaybe<Cases_Order_By>;
  case_cases?: InputMaybe<Order_By>;
  category?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  file_type?: InputMaybe<Order_By>;
  file_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  journey?: InputMaybe<Journeys_Order_By>;
  journey_journeys?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cases_files */
export type Cases_Files_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "cases_files" */
export enum Cases_Files_Select_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  Category = 'category',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileType = 'file_type',
  /** column name */
  FileUrl = 'file_url',
  /** column name */
  Id = 'id',
  /** column name */
  JourneyJourneys = 'journey_journeys',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cases_files" */
export type Cases_Files_Set_Input = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 文件类型 */
  file_type?: InputMaybe<Scalars['String']['input']>;
  /** 文件地址 */
  file_url?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cases_Files_Stddev_Fields = {
  __typename?: 'cases_files_stddev_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "cases_files" */
export type Cases_Files_Stddev_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Cases_Files_Stddev_Pop_Fields = {
  __typename?: 'cases_files_stddev_pop_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "cases_files" */
export type Cases_Files_Stddev_Pop_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Cases_Files_Stddev_Samp_Fields = {
  __typename?: 'cases_files_stddev_samp_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "cases_files" */
export type Cases_Files_Stddev_Samp_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "cases_files" */
export type Cases_Files_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cases_Files_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cases_Files_Stream_Cursor_Value_Input = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 文件分类：1.EmbryoDocs 2.SurrogateInfo 3.LegalDocs 4.Other */
  category?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 文件类型 */
  file_type?: InputMaybe<Scalars['String']['input']>;
  /** 文件地址 */
  file_url?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cases_Files_Sum_Fields = {
  __typename?: 'cases_files_sum_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "cases_files" */
export type Cases_Files_Sum_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** update columns of table "cases_files" */
export enum Cases_Files_Update_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  Category = 'category',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileType = 'file_type',
  /** column name */
  FileUrl = 'file_url',
  /** column name */
  Id = 'id',
  /** column name */
  JourneyJourneys = 'journey_journeys',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cases_Files_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cases_Files_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cases_Files_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cases_Files_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cases_Files_Var_Pop_Fields = {
  __typename?: 'cases_files_var_pop_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "cases_files" */
export type Cases_Files_Var_Pop_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Cases_Files_Var_Samp_Fields = {
  __typename?: 'cases_files_var_samp_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "cases_files" */
export type Cases_Files_Var_Samp_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Cases_Files_Variance_Fields = {
  __typename?: 'cases_files_variance_fields';
  /** 外键，关联cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 和journey相关的文件 */
  journey_journeys?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "cases_files" */
export type Cases_Files_Variance_Order_By = {
  /** 外键，关联cases */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 和journey相关的文件 */
  journey_journeys?: InputMaybe<Order_By>;
};

/** input type for incrementing numeric columns in table "cases" */
export type Cases_Inc_Input = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "cases" */
export type Cases_Insert_Input = {
  cases_files?: InputMaybe<Cases_Files_Arr_Rel_Insert_Input>;
  client_manager?: InputMaybe<Client_Managers_Obj_Rel_Insert_Input>;
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  intended_parent?: InputMaybe<Intended_Parents_Obj_Rel_Insert_Input>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  ivf_clinics?: InputMaybe<Ivf_Clinics_Arr_Rel_Insert_Input>;
  posts?: InputMaybe<Posts_Arr_Rel_Insert_Input>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: InputMaybe<Scalars['String']['input']>;
  surrogate_mother?: InputMaybe<Surrogate_Mothers_Obj_Rel_Insert_Input>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cases_Max_Fields = {
  __typename?: 'cases_max_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: Maybe<Scalars['String']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['numeric']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "cases" */
export type Cases_Max_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cases_Min_Fields = {
  __typename?: 'cases_min_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: Maybe<Scalars['String']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['numeric']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "cases" */
export type Cases_Min_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cases" */
export type Cases_Mutation_Response = {
  __typename?: 'cases_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cases>;
};

/** input type for inserting object relation for remote table "cases" */
export type Cases_Obj_Rel_Insert_Input = {
  data: Cases_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cases_On_Conflict>;
};

/** on_conflict condition type for table "cases" */
export type Cases_On_Conflict = {
  constraint: Cases_Constraint;
  update_columns?: Array<Cases_Update_Column>;
  where?: InputMaybe<Cases_Bool_Exp>;
};

/** Ordering options when selecting data from "cases". */
export type Cases_Order_By = {
  cases_files_aggregate?: InputMaybe<Cases_Files_Aggregate_Order_By>;
  client_manager?: InputMaybe<Client_Managers_Order_By>;
  client_manager_client_managers?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  intended_parent?: InputMaybe<Intended_Parents_Order_By>;
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  ivf_clinics_aggregate?: InputMaybe<Ivf_Clinics_Aggregate_Order_By>;
  posts_aggregate?: InputMaybe<Posts_Aggregate_Order_By>;
  process_status?: InputMaybe<Order_By>;
  surrogate_mother?: InputMaybe<Surrogate_Mothers_Order_By>;
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  trust_account_balance?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cases */
export type Cases_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "cases" */
export enum Cases_Select_Column {
  /** column name */
  ClientManagerClientManagers = 'client_manager_client_managers',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntendedParentIntendedParents = 'intended_parent_intended_parents',
  /** column name */
  ProcessStatus = 'process_status',
  /** column name */
  SurrogateMotherSurrogateMothers = 'surrogate_mother_surrogate_mothers',
  /** column name */
  TrustAccountBalance = 'trust_account_balance',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cases" */
export type Cases_Set_Input = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: InputMaybe<Scalars['String']['input']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cases_Stddev_Fields = {
  __typename?: 'cases_stddev_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "cases" */
export type Cases_Stddev_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Cases_Stddev_Pop_Fields = {
  __typename?: 'cases_stddev_pop_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "cases" */
export type Cases_Stddev_Pop_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Cases_Stddev_Samp_Fields = {
  __typename?: 'cases_stddev_samp_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "cases" */
export type Cases_Stddev_Samp_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "cases" */
export type Cases_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cases_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cases_Stream_Cursor_Value_Input = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 状态分类 1.Matching 2.LegalStage 3.CyclePrep 4.Pregnant 5.Transferred */
  process_status?: InputMaybe<Scalars['String']['input']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cases_Sum_Fields = {
  __typename?: 'cases_sum_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "cases" */
export type Cases_Sum_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** update columns of table "cases" */
export enum Cases_Update_Column {
  /** column name */
  ClientManagerClientManagers = 'client_manager_client_managers',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntendedParentIntendedParents = 'intended_parent_intended_parents',
  /** column name */
  ProcessStatus = 'process_status',
  /** column name */
  SurrogateMotherSurrogateMothers = 'surrogate_mother_surrogate_mothers',
  /** column name */
  TrustAccountBalance = 'trust_account_balance',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cases_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cases_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cases_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cases_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cases_Var_Pop_Fields = {
  __typename?: 'cases_var_pop_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "cases" */
export type Cases_Var_Pop_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Cases_Var_Samp_Fields = {
  __typename?: 'cases_var_samp_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "cases" */
export type Cases_Var_Samp_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Cases_Variance_Fields = {
  __typename?: 'cases_variance_fields';
  /** 外键，客户经理 */
  client_manager_client_managers?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "cases" */
export type Cases_Variance_Order_By = {
  /** 外键，客户经理 */
  client_manager_client_managers?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，代孕妈妈 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  /** 当前case的信托账户余额 */
  trust_account_balance?: InputMaybe<Order_By>;
};

/** 客户经理 */
export type Client_Managers = {
  __typename?: 'client_managers';
  /** An array relationship */
  cases: Array<Cases>;
  /** An aggregate relationship */
  cases_aggregate: Cases_Aggregate;
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  password: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 客户经理 */
export type Client_ManagersCasesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


/** 客户经理 */
export type Client_ManagersCases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};

/** aggregated selection of "client_managers" */
export type Client_Managers_Aggregate = {
  __typename?: 'client_managers_aggregate';
  aggregate?: Maybe<Client_Managers_Aggregate_Fields>;
  nodes: Array<Client_Managers>;
};

/** aggregate fields of "client_managers" */
export type Client_Managers_Aggregate_Fields = {
  __typename?: 'client_managers_aggregate_fields';
  avg?: Maybe<Client_Managers_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Client_Managers_Max_Fields>;
  min?: Maybe<Client_Managers_Min_Fields>;
  stddev?: Maybe<Client_Managers_Stddev_Fields>;
  stddev_pop?: Maybe<Client_Managers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Client_Managers_Stddev_Samp_Fields>;
  sum?: Maybe<Client_Managers_Sum_Fields>;
  var_pop?: Maybe<Client_Managers_Var_Pop_Fields>;
  var_samp?: Maybe<Client_Managers_Var_Samp_Fields>;
  variance?: Maybe<Client_Managers_Variance_Fields>;
};


/** aggregate fields of "client_managers" */
export type Client_Managers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Client_Managers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Client_Managers_Avg_Fields = {
  __typename?: 'client_managers_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "client_managers". All fields are combined with a logical 'AND'. */
export type Client_Managers_Bool_Exp = {
  _and?: InputMaybe<Array<Client_Managers_Bool_Exp>>;
  _not?: InputMaybe<Client_Managers_Bool_Exp>;
  _or?: InputMaybe<Array<Client_Managers_Bool_Exp>>;
  cases?: InputMaybe<Cases_Bool_Exp>;
  cases_aggregate?: InputMaybe<Cases_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "client_managers" */
export enum Client_Managers_Constraint {
  /** unique or primary key constraint on columns "email" */
  ClientManagersEmailKey = 'client_managers_email_key',
  /** unique or primary key constraint on columns "id" */
  ClientManagersPkey = 'client_managers_pkey'
}

/** input type for incrementing numeric columns in table "client_managers" */
export type Client_Managers_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "client_managers" */
export type Client_Managers_Insert_Input = {
  cases?: InputMaybe<Cases_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Client_Managers_Max_Fields = {
  __typename?: 'client_managers_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Client_Managers_Min_Fields = {
  __typename?: 'client_managers_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "client_managers" */
export type Client_Managers_Mutation_Response = {
  __typename?: 'client_managers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Client_Managers>;
};

/** input type for inserting object relation for remote table "client_managers" */
export type Client_Managers_Obj_Rel_Insert_Input = {
  data: Client_Managers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Client_Managers_On_Conflict>;
};

/** on_conflict condition type for table "client_managers" */
export type Client_Managers_On_Conflict = {
  constraint: Client_Managers_Constraint;
  update_columns?: Array<Client_Managers_Update_Column>;
  where?: InputMaybe<Client_Managers_Bool_Exp>;
};

/** Ordering options when selecting data from "client_managers". */
export type Client_Managers_Order_By = {
  cases_aggregate?: InputMaybe<Cases_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: client_managers */
export type Client_Managers_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "client_managers" */
export enum Client_Managers_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "client_managers" */
export type Client_Managers_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Client_Managers_Stddev_Fields = {
  __typename?: 'client_managers_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Client_Managers_Stddev_Pop_Fields = {
  __typename?: 'client_managers_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Client_Managers_Stddev_Samp_Fields = {
  __typename?: 'client_managers_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "client_managers" */
export type Client_Managers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Client_Managers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Client_Managers_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Client_Managers_Sum_Fields = {
  __typename?: 'client_managers_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "client_managers" */
export enum Client_Managers_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Client_Managers_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Client_Managers_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Client_Managers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Client_Managers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Client_Managers_Var_Pop_Fields = {
  __typename?: 'client_managers_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Client_Managers_Var_Samp_Fields = {
  __typename?: 'client_managers_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Client_Managers_Variance_Fields = {
  __typename?: 'client_managers_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** 准父母表 */
export type Intended_Parents = {
  __typename?: 'intended_parents';
  /** 基本信息 */
  basic_information?: Maybe<Scalars['jsonb']['output']>;
  /** An array relationship */
  cases: Array<Cases>;
  /** An aggregate relationship */
  cases_aggregate: Cases_Aggregate;
  /** 联系信息 */
  contact_information?: Maybe<Scalars['jsonb']['output']>;
  created_at: Scalars['timestamptz']['output'];
  /** 准父母邮箱，作为登录的邮箱 */
  email: Scalars['String']['output'];
  /** 家庭资料 */
  family_profile?: Maybe<Scalars['jsonb']['output']>;
  id: Scalars['bigint']['output'];
  /** 登录密码 */
  password?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  post_comments: Array<Post_Comments>;
  /** An aggregate relationship */
  post_comments_aggregate: Post_Comments_Aggregate;
  /** 项目意向 */
  program_interests?: Maybe<Scalars['jsonb']['output']>;
  /** 渠道及初步沟通 */
  referral?: Maybe<Scalars['jsonb']['output']>;
  /** 信托账户余额 */
  trust_account_balance: Scalars['numeric']['output'];
  /** An array relationship */
  trust_account_balance_changes: Array<Trust_Account_Balance_Changes>;
  /** An aggregate relationship */
  trust_account_balance_changes_aggregate: Trust_Account_Balance_Changes_Aggregate;
  updated_at: Scalars['timestamptz']['output'];
};


/** 准父母表 */
export type Intended_ParentsBasic_InformationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 准父母表 */
export type Intended_ParentsCasesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


/** 准父母表 */
export type Intended_ParentsCases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


/** 准父母表 */
export type Intended_ParentsContact_InformationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 准父母表 */
export type Intended_ParentsFamily_ProfileArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 准父母表 */
export type Intended_ParentsPost_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


/** 准父母表 */
export type Intended_ParentsPost_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


/** 准父母表 */
export type Intended_ParentsProgram_InterestsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 准父母表 */
export type Intended_ParentsReferralArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 准父母表 */
export type Intended_ParentsTrust_Account_Balance_ChangesArgs = {
  distinct_on?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Trust_Account_Balance_Changes_Order_By>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};


/** 准父母表 */
export type Intended_ParentsTrust_Account_Balance_Changes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Trust_Account_Balance_Changes_Order_By>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};

/** aggregated selection of "intended_parents" */
export type Intended_Parents_Aggregate = {
  __typename?: 'intended_parents_aggregate';
  aggregate?: Maybe<Intended_Parents_Aggregate_Fields>;
  nodes: Array<Intended_Parents>;
};

/** aggregate fields of "intended_parents" */
export type Intended_Parents_Aggregate_Fields = {
  __typename?: 'intended_parents_aggregate_fields';
  avg?: Maybe<Intended_Parents_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Intended_Parents_Max_Fields>;
  min?: Maybe<Intended_Parents_Min_Fields>;
  stddev?: Maybe<Intended_Parents_Stddev_Fields>;
  stddev_pop?: Maybe<Intended_Parents_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Intended_Parents_Stddev_Samp_Fields>;
  sum?: Maybe<Intended_Parents_Sum_Fields>;
  var_pop?: Maybe<Intended_Parents_Var_Pop_Fields>;
  var_samp?: Maybe<Intended_Parents_Var_Samp_Fields>;
  variance?: Maybe<Intended_Parents_Variance_Fields>;
};


/** aggregate fields of "intended_parents" */
export type Intended_Parents_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Intended_Parents_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Intended_Parents_Append_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Intended_Parents_Avg_Fields = {
  __typename?: 'intended_parents_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "intended_parents". All fields are combined with a logical 'AND'. */
export type Intended_Parents_Bool_Exp = {
  _and?: InputMaybe<Array<Intended_Parents_Bool_Exp>>;
  _not?: InputMaybe<Intended_Parents_Bool_Exp>;
  _or?: InputMaybe<Array<Intended_Parents_Bool_Exp>>;
  basic_information?: InputMaybe<Jsonb_Comparison_Exp>;
  cases?: InputMaybe<Cases_Bool_Exp>;
  cases_aggregate?: InputMaybe<Cases_Aggregate_Bool_Exp>;
  contact_information?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  family_profile?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  post_comments?: InputMaybe<Post_Comments_Bool_Exp>;
  post_comments_aggregate?: InputMaybe<Post_Comments_Aggregate_Bool_Exp>;
  program_interests?: InputMaybe<Jsonb_Comparison_Exp>;
  referral?: InputMaybe<Jsonb_Comparison_Exp>;
  trust_account_balance?: InputMaybe<Numeric_Comparison_Exp>;
  trust_account_balance_changes?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
  trust_account_balance_changes_aggregate?: InputMaybe<Trust_Account_Balance_Changes_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "intended_parents" */
export enum Intended_Parents_Constraint {
  /** unique or primary key constraint on columns "email" */
  IntendedParentsEmailKey = 'intended_parents_email_key',
  /** unique or primary key constraint on columns "id" */
  IntendedParentsPkey = 'intended_parents_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Intended_Parents_Delete_At_Path_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 联系信息 */
  contact_information?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 项目意向 */
  program_interests?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Intended_Parents_Delete_Elem_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['Int']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['Int']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['Int']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['Int']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Intended_Parents_Delete_Key_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['String']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['String']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['String']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['String']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "intended_parents" */
export type Intended_Parents_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "intended_parents" */
export type Intended_Parents_Insert_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['jsonb']['input']>;
  cases?: InputMaybe<Cases_Arr_Rel_Insert_Input>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 准父母邮箱，作为登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 登录密码 */
  password?: InputMaybe<Scalars['String']['input']>;
  post_comments?: InputMaybe<Post_Comments_Arr_Rel_Insert_Input>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
  /** 信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
  trust_account_balance_changes?: InputMaybe<Trust_Account_Balance_Changes_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Intended_Parents_Max_Fields = {
  __typename?: 'intended_parents_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 准父母邮箱，作为登录的邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 登录密码 */
  password?: Maybe<Scalars['String']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['numeric']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Intended_Parents_Min_Fields = {
  __typename?: 'intended_parents_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 准父母邮箱，作为登录的邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 登录密码 */
  password?: Maybe<Scalars['String']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['numeric']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "intended_parents" */
export type Intended_Parents_Mutation_Response = {
  __typename?: 'intended_parents_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Intended_Parents>;
};

/** input type for inserting object relation for remote table "intended_parents" */
export type Intended_Parents_Obj_Rel_Insert_Input = {
  data: Intended_Parents_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Intended_Parents_On_Conflict>;
};

/** on_conflict condition type for table "intended_parents" */
export type Intended_Parents_On_Conflict = {
  constraint: Intended_Parents_Constraint;
  update_columns?: Array<Intended_Parents_Update_Column>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};

/** Ordering options when selecting data from "intended_parents". */
export type Intended_Parents_Order_By = {
  basic_information?: InputMaybe<Order_By>;
  cases_aggregate?: InputMaybe<Cases_Aggregate_Order_By>;
  contact_information?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  family_profile?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  post_comments_aggregate?: InputMaybe<Post_Comments_Aggregate_Order_By>;
  program_interests?: InputMaybe<Order_By>;
  referral?: InputMaybe<Order_By>;
  trust_account_balance?: InputMaybe<Order_By>;
  trust_account_balance_changes_aggregate?: InputMaybe<Trust_Account_Balance_Changes_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: intended_parents */
export type Intended_Parents_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Intended_Parents_Prepend_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "intended_parents" */
export enum Intended_Parents_Select_Column {
  /** column name */
  BasicInformation = 'basic_information',
  /** column name */
  ContactInformation = 'contact_information',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyProfile = 'family_profile',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  ProgramInterests = 'program_interests',
  /** column name */
  Referral = 'referral',
  /** column name */
  TrustAccountBalance = 'trust_account_balance',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "intended_parents" */
export type Intended_Parents_Set_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 准父母邮箱，作为登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 登录密码 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
  /** 信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Intended_Parents_Stddev_Fields = {
  __typename?: 'intended_parents_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Intended_Parents_Stddev_Pop_Fields = {
  __typename?: 'intended_parents_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Intended_Parents_Stddev_Samp_Fields = {
  __typename?: 'intended_parents_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "intended_parents" */
export type Intended_Parents_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Intended_Parents_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Intended_Parents_Stream_Cursor_Value_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 准父母邮箱，作为登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 登录密码 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
  /** 信托账户余额 */
  trust_account_balance?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Intended_Parents_Sum_Fields = {
  __typename?: 'intended_parents_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "intended_parents" */
export enum Intended_Parents_Update_Column {
  /** column name */
  BasicInformation = 'basic_information',
  /** column name */
  ContactInformation = 'contact_information',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyProfile = 'family_profile',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  ProgramInterests = 'program_interests',
  /** column name */
  Referral = 'referral',
  /** column name */
  TrustAccountBalance = 'trust_account_balance',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Intended_Parents_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Intended_Parents_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Intended_Parents_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Intended_Parents_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Intended_Parents_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Intended_Parents_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Intended_Parents_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Intended_Parents_Set_Input>;
  /** filter the rows which have to be updated */
  where: Intended_Parents_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Intended_Parents_Var_Pop_Fields = {
  __typename?: 'intended_parents_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Intended_Parents_Var_Samp_Fields = {
  __typename?: 'intended_parents_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Intended_Parents_Variance_Fields = {
  __typename?: 'intended_parents_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 信托账户余额 */
  trust_account_balance?: Maybe<Scalars['Float']['output']>;
};

/** 体外受精诊所记录信息 */
export type Ivf_Clinics = {
  __typename?: 'ivf_clinics';
  /** An object relationship */
  case?: Maybe<Cases>;
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  created_at: Scalars['timestamptz']['output'];
  /** 根据不同的type，有不同的数据结构 */
  data: Scalars['jsonb']['output'];
  id: Scalars['bigint']['output'];
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 体外受精诊所记录信息 */
export type Ivf_ClinicsDataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "ivf_clinics" */
export type Ivf_Clinics_Aggregate = {
  __typename?: 'ivf_clinics_aggregate';
  aggregate?: Maybe<Ivf_Clinics_Aggregate_Fields>;
  nodes: Array<Ivf_Clinics>;
};

export type Ivf_Clinics_Aggregate_Bool_Exp = {
  count?: InputMaybe<Ivf_Clinics_Aggregate_Bool_Exp_Count>;
};

export type Ivf_Clinics_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Ivf_Clinics_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "ivf_clinics" */
export type Ivf_Clinics_Aggregate_Fields = {
  __typename?: 'ivf_clinics_aggregate_fields';
  avg?: Maybe<Ivf_Clinics_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Ivf_Clinics_Max_Fields>;
  min?: Maybe<Ivf_Clinics_Min_Fields>;
  stddev?: Maybe<Ivf_Clinics_Stddev_Fields>;
  stddev_pop?: Maybe<Ivf_Clinics_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Ivf_Clinics_Stddev_Samp_Fields>;
  sum?: Maybe<Ivf_Clinics_Sum_Fields>;
  var_pop?: Maybe<Ivf_Clinics_Var_Pop_Fields>;
  var_samp?: Maybe<Ivf_Clinics_Var_Samp_Fields>;
  variance?: Maybe<Ivf_Clinics_Variance_Fields>;
};


/** aggregate fields of "ivf_clinics" */
export type Ivf_Clinics_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "ivf_clinics" */
export type Ivf_Clinics_Aggregate_Order_By = {
  avg?: InputMaybe<Ivf_Clinics_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Ivf_Clinics_Max_Order_By>;
  min?: InputMaybe<Ivf_Clinics_Min_Order_By>;
  stddev?: InputMaybe<Ivf_Clinics_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Ivf_Clinics_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Ivf_Clinics_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Ivf_Clinics_Sum_Order_By>;
  var_pop?: InputMaybe<Ivf_Clinics_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Ivf_Clinics_Var_Samp_Order_By>;
  variance?: InputMaybe<Ivf_Clinics_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Ivf_Clinics_Append_Input = {
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "ivf_clinics" */
export type Ivf_Clinics_Arr_Rel_Insert_Input = {
  data: Array<Ivf_Clinics_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Ivf_Clinics_On_Conflict>;
};

/** aggregate avg on columns */
export type Ivf_Clinics_Avg_Fields = {
  __typename?: 'ivf_clinics_avg_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Avg_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ivf_clinics". All fields are combined with a logical 'AND'. */
export type Ivf_Clinics_Bool_Exp = {
  _and?: InputMaybe<Array<Ivf_Clinics_Bool_Exp>>;
  _not?: InputMaybe<Ivf_Clinics_Bool_Exp>;
  _or?: InputMaybe<Array<Ivf_Clinics_Bool_Exp>>;
  case?: InputMaybe<Cases_Bool_Exp>;
  case_cases?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "ivf_clinics" */
export enum Ivf_Clinics_Constraint {
  /** unique or primary key constraint on columns "id" */
  IvfClinicsPkey = 'ivf_clinics_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Ivf_Clinics_Delete_At_Path_Input = {
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Ivf_Clinics_Delete_Elem_Input = {
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Ivf_Clinics_Delete_Key_Input = {
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "ivf_clinics" */
export type Ivf_Clinics_Inc_Input = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "ivf_clinics" */
export type Ivf_Clinics_Insert_Input = {
  case?: InputMaybe<Cases_Obj_Rel_Insert_Input>;
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Ivf_Clinics_Max_Fields = {
  __typename?: 'ivf_clinics_max_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Max_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Ivf_Clinics_Min_Fields = {
  __typename?: 'ivf_clinics_min_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Min_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "ivf_clinics" */
export type Ivf_Clinics_Mutation_Response = {
  __typename?: 'ivf_clinics_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Ivf_Clinics>;
};

/** on_conflict condition type for table "ivf_clinics" */
export type Ivf_Clinics_On_Conflict = {
  constraint: Ivf_Clinics_Constraint;
  update_columns?: Array<Ivf_Clinics_Update_Column>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};

/** Ordering options when selecting data from "ivf_clinics". */
export type Ivf_Clinics_Order_By = {
  case?: InputMaybe<Cases_Order_By>;
  case_cases?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: ivf_clinics */
export type Ivf_Clinics_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Ivf_Clinics_Prepend_Input = {
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "ivf_clinics" */
export enum Ivf_Clinics_Select_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "ivf_clinics" */
export type Ivf_Clinics_Set_Input = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Ivf_Clinics_Stddev_Fields = {
  __typename?: 'ivf_clinics_stddev_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Stddev_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Ivf_Clinics_Stddev_Pop_Fields = {
  __typename?: 'ivf_clinics_stddev_pop_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Stddev_Pop_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Ivf_Clinics_Stddev_Samp_Fields = {
  __typename?: 'ivf_clinics_stddev_samp_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Stddev_Samp_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ivf_clinics" */
export type Ivf_Clinics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Ivf_Clinics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Ivf_Clinics_Stream_Cursor_Value_Input = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 根据不同的type，有不同的数据结构 */
  data?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 可选值：1.ClinicOverview 2.EmbryoJourney 3.SurrogateAppointments 4.MedicationTracker 5.DoctorNotes */
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Ivf_Clinics_Sum_Fields = {
  __typename?: 'ivf_clinics_sum_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Sum_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** update columns of table "ivf_clinics" */
export enum Ivf_Clinics_Update_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Ivf_Clinics_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Ivf_Clinics_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Ivf_Clinics_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Ivf_Clinics_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Ivf_Clinics_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Ivf_Clinics_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Ivf_Clinics_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Ivf_Clinics_Set_Input>;
  /** filter the rows which have to be updated */
  where: Ivf_Clinics_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Ivf_Clinics_Var_Pop_Fields = {
  __typename?: 'ivf_clinics_var_pop_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Var_Pop_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Ivf_Clinics_Var_Samp_Fields = {
  __typename?: 'ivf_clinics_var_samp_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Var_Samp_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Ivf_Clinics_Variance_Fields = {
  __typename?: 'ivf_clinics_variance_fields';
  /** 外键，关联cases表 */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "ivf_clinics" */
export type Ivf_Clinics_Variance_Order_By = {
  /** 外键，关联cases表 */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** 代孕旅程 */
export type Journeys = {
  __typename?: 'journeys';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** An array relationship */
  cases_files: Array<Cases_Files>;
  /** An aggregate relationship */
  cases_files_aggregate: Cases_Files_Aggregate;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['bigint']['output']>;
  /** 标题 */
  title?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};


/** 代孕旅程 */
export type JourneysCases_FilesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


/** 代孕旅程 */
export type JourneysCases_Files_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};

/** aggregated selection of "journeys" */
export type Journeys_Aggregate = {
  __typename?: 'journeys_aggregate';
  aggregate?: Maybe<Journeys_Aggregate_Fields>;
  nodes: Array<Journeys>;
};

/** aggregate fields of "journeys" */
export type Journeys_Aggregate_Fields = {
  __typename?: 'journeys_aggregate_fields';
  avg?: Maybe<Journeys_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Journeys_Max_Fields>;
  min?: Maybe<Journeys_Min_Fields>;
  stddev?: Maybe<Journeys_Stddev_Fields>;
  stddev_pop?: Maybe<Journeys_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Journeys_Stddev_Samp_Fields>;
  sum?: Maybe<Journeys_Sum_Fields>;
  var_pop?: Maybe<Journeys_Var_Pop_Fields>;
  var_samp?: Maybe<Journeys_Var_Samp_Fields>;
  variance?: Maybe<Journeys_Variance_Fields>;
};


/** aggregate fields of "journeys" */
export type Journeys_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Journeys_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Journeys_Avg_Fields = {
  __typename?: 'journeys_avg_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "journeys". All fields are combined with a logical 'AND'. */
export type Journeys_Bool_Exp = {
  _and?: InputMaybe<Array<Journeys_Bool_Exp>>;
  _not?: InputMaybe<Journeys_Bool_Exp>;
  _or?: InputMaybe<Array<Journeys_Bool_Exp>>;
  case_cases?: InputMaybe<Bigint_Comparison_Exp>;
  cases_files?: InputMaybe<Cases_Files_Bool_Exp>;
  cases_files_aggregate?: InputMaybe<Cases_Files_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  stage?: InputMaybe<Bigint_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "journeys" */
export enum Journeys_Constraint {
  /** unique or primary key constraint on columns "id" */
  JourneysPkey = 'journeys_pkey'
}

/** input type for incrementing numeric columns in table "journeys" */
export type Journeys_Inc_Input = {
  /** 关联外键，cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 步骤序号：1-7 */
  stage?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "journeys" */
export type Journeys_Insert_Input = {
  /** 关联外键，cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  cases_files?: InputMaybe<Cases_Files_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 步骤序号：1-7 */
  stage?: InputMaybe<Scalars['bigint']['input']>;
  /** 标题 */
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Journeys_Max_Fields = {
  __typename?: 'journeys_max_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['bigint']['output']>;
  /** 标题 */
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Journeys_Min_Fields = {
  __typename?: 'journeys_min_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['bigint']['output']>;
  /** 标题 */
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "journeys" */
export type Journeys_Mutation_Response = {
  __typename?: 'journeys_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Journeys>;
};

/** input type for inserting object relation for remote table "journeys" */
export type Journeys_Obj_Rel_Insert_Input = {
  data: Journeys_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Journeys_On_Conflict>;
};

/** on_conflict condition type for table "journeys" */
export type Journeys_On_Conflict = {
  constraint: Journeys_Constraint;
  update_columns?: Array<Journeys_Update_Column>;
  where?: InputMaybe<Journeys_Bool_Exp>;
};

/** Ordering options when selecting data from "journeys". */
export type Journeys_Order_By = {
  case_cases?: InputMaybe<Order_By>;
  cases_files_aggregate?: InputMaybe<Cases_Files_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: journeys */
export type Journeys_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "journeys" */
export enum Journeys_Select_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Stage = 'stage',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "journeys" */
export type Journeys_Set_Input = {
  /** 关联外键，cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 步骤序号：1-7 */
  stage?: InputMaybe<Scalars['bigint']['input']>;
  /** 标题 */
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Journeys_Stddev_Fields = {
  __typename?: 'journeys_stddev_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Journeys_Stddev_Pop_Fields = {
  __typename?: 'journeys_stddev_pop_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Journeys_Stddev_Samp_Fields = {
  __typename?: 'journeys_stddev_samp_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "journeys" */
export type Journeys_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Journeys_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Journeys_Stream_Cursor_Value_Input = {
  /** 关联外键，cases */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 步骤序号：1-7 */
  stage?: InputMaybe<Scalars['bigint']['input']>;
  /** 标题 */
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Journeys_Sum_Fields = {
  __typename?: 'journeys_sum_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "journeys" */
export enum Journeys_Update_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Stage = 'stage',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Journeys_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Journeys_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Journeys_Set_Input>;
  /** filter the rows which have to be updated */
  where: Journeys_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Journeys_Var_Pop_Fields = {
  __typename?: 'journeys_var_pop_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Journeys_Var_Samp_Fields = {
  __typename?: 'journeys_var_samp_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Journeys_Variance_Fields = {
  __typename?: 'journeys_variance_fields';
  /** 关联外键，cases */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 步骤序号：1-7 */
  stage?: Maybe<Scalars['Float']['output']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** 管理员 */
export type Managers = {
  __typename?: 'managers';
  created_at: Scalars['timestamptz']['output'];
  /** 登录的邮箱 */
  email: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  password: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "managers" */
export type Managers_Aggregate = {
  __typename?: 'managers_aggregate';
  aggregate?: Maybe<Managers_Aggregate_Fields>;
  nodes: Array<Managers>;
};

/** aggregate fields of "managers" */
export type Managers_Aggregate_Fields = {
  __typename?: 'managers_aggregate_fields';
  avg?: Maybe<Managers_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Managers_Max_Fields>;
  min?: Maybe<Managers_Min_Fields>;
  stddev?: Maybe<Managers_Stddev_Fields>;
  stddev_pop?: Maybe<Managers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Managers_Stddev_Samp_Fields>;
  sum?: Maybe<Managers_Sum_Fields>;
  var_pop?: Maybe<Managers_Var_Pop_Fields>;
  var_samp?: Maybe<Managers_Var_Samp_Fields>;
  variance?: Maybe<Managers_Variance_Fields>;
};


/** aggregate fields of "managers" */
export type Managers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Managers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Managers_Avg_Fields = {
  __typename?: 'managers_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "managers". All fields are combined with a logical 'AND'. */
export type Managers_Bool_Exp = {
  _and?: InputMaybe<Array<Managers_Bool_Exp>>;
  _not?: InputMaybe<Managers_Bool_Exp>;
  _or?: InputMaybe<Array<Managers_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "managers" */
export enum Managers_Constraint {
  /** unique or primary key constraint on columns "email" */
  ManagersEmailKey = 'managers_email_key',
  /** unique or primary key constraint on columns "id" */
  ManagersPkey = 'managers_pkey'
}

/** input type for incrementing numeric columns in table "managers" */
export type Managers_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "managers" */
export type Managers_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Managers_Max_Fields = {
  __typename?: 'managers_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 登录的邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Managers_Min_Fields = {
  __typename?: 'managers_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 登录的邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "managers" */
export type Managers_Mutation_Response = {
  __typename?: 'managers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Managers>;
};

/** on_conflict condition type for table "managers" */
export type Managers_On_Conflict = {
  constraint: Managers_Constraint;
  update_columns?: Array<Managers_Update_Column>;
  where?: InputMaybe<Managers_Bool_Exp>;
};

/** Ordering options when selecting data from "managers". */
export type Managers_Order_By = {
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: managers */
export type Managers_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "managers" */
export enum Managers_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "managers" */
export type Managers_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Managers_Stddev_Fields = {
  __typename?: 'managers_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Managers_Stddev_Pop_Fields = {
  __typename?: 'managers_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Managers_Stddev_Samp_Fields = {
  __typename?: 'managers_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "managers" */
export type Managers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Managers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Managers_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Managers_Sum_Fields = {
  __typename?: 'managers_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "managers" */
export enum Managers_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Managers_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Managers_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Managers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Managers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Managers_Var_Pop_Fields = {
  __typename?: 'managers_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Managers_Var_Samp_Fields = {
  __typename?: 'managers_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Managers_Variance_Fields = {
  __typename?: 'managers_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "applications" */
  delete_applications?: Maybe<Applications_Mutation_Response>;
  /** delete single row from the table: "applications" */
  delete_applications_by_pk?: Maybe<Applications>;
  /** delete data from the table: "cases" */
  delete_cases?: Maybe<Cases_Mutation_Response>;
  /** delete single row from the table: "cases" */
  delete_cases_by_pk?: Maybe<Cases>;
  /** delete data from the table: "cases_files" */
  delete_cases_files?: Maybe<Cases_Files_Mutation_Response>;
  /** delete single row from the table: "cases_files" */
  delete_cases_files_by_pk?: Maybe<Cases_Files>;
  /** delete data from the table: "client_managers" */
  delete_client_managers?: Maybe<Client_Managers_Mutation_Response>;
  /** delete single row from the table: "client_managers" */
  delete_client_managers_by_pk?: Maybe<Client_Managers>;
  /** delete data from the table: "intended_parents" */
  delete_intended_parents?: Maybe<Intended_Parents_Mutation_Response>;
  /** delete single row from the table: "intended_parents" */
  delete_intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** delete data from the table: "ivf_clinics" */
  delete_ivf_clinics?: Maybe<Ivf_Clinics_Mutation_Response>;
  /** delete single row from the table: "ivf_clinics" */
  delete_ivf_clinics_by_pk?: Maybe<Ivf_Clinics>;
  /** delete data from the table: "journeys" */
  delete_journeys?: Maybe<Journeys_Mutation_Response>;
  /** delete single row from the table: "journeys" */
  delete_journeys_by_pk?: Maybe<Journeys>;
  /** delete data from the table: "managers" */
  delete_managers?: Maybe<Managers_Mutation_Response>;
  /** delete single row from the table: "managers" */
  delete_managers_by_pk?: Maybe<Managers>;
  /** delete data from the table: "post_comments" */
  delete_post_comments?: Maybe<Post_Comments_Mutation_Response>;
  /** delete single row from the table: "post_comments" */
  delete_post_comments_by_pk?: Maybe<Post_Comments>;
  /** delete data from the table: "posts" */
  delete_posts?: Maybe<Posts_Mutation_Response>;
  /** delete single row from the table: "posts" */
  delete_posts_by_pk?: Maybe<Posts>;
  /** delete data from the table: "surrogate_mothers" */
  delete_surrogate_mothers?: Maybe<Surrogate_Mothers_Mutation_Response>;
  /** delete single row from the table: "surrogate_mothers" */
  delete_surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** delete data from the table: "trust_account_balance_changes" */
  delete_trust_account_balance_changes?: Maybe<Trust_Account_Balance_Changes_Mutation_Response>;
  /** delete single row from the table: "trust_account_balance_changes" */
  delete_trust_account_balance_changes_by_pk?: Maybe<Trust_Account_Balance_Changes>;
  /** insert data into the table: "applications" */
  insert_applications?: Maybe<Applications_Mutation_Response>;
  /** insert a single row into the table: "applications" */
  insert_applications_one?: Maybe<Applications>;
  /** insert data into the table: "cases" */
  insert_cases?: Maybe<Cases_Mutation_Response>;
  /** insert data into the table: "cases_files" */
  insert_cases_files?: Maybe<Cases_Files_Mutation_Response>;
  /** insert a single row into the table: "cases_files" */
  insert_cases_files_one?: Maybe<Cases_Files>;
  /** insert a single row into the table: "cases" */
  insert_cases_one?: Maybe<Cases>;
  /** insert data into the table: "client_managers" */
  insert_client_managers?: Maybe<Client_Managers_Mutation_Response>;
  /** insert a single row into the table: "client_managers" */
  insert_client_managers_one?: Maybe<Client_Managers>;
  /** insert data into the table: "intended_parents" */
  insert_intended_parents?: Maybe<Intended_Parents_Mutation_Response>;
  /** insert a single row into the table: "intended_parents" */
  insert_intended_parents_one?: Maybe<Intended_Parents>;
  /** insert data into the table: "ivf_clinics" */
  insert_ivf_clinics?: Maybe<Ivf_Clinics_Mutation_Response>;
  /** insert a single row into the table: "ivf_clinics" */
  insert_ivf_clinics_one?: Maybe<Ivf_Clinics>;
  /** insert data into the table: "journeys" */
  insert_journeys?: Maybe<Journeys_Mutation_Response>;
  /** insert a single row into the table: "journeys" */
  insert_journeys_one?: Maybe<Journeys>;
  /** insert data into the table: "managers" */
  insert_managers?: Maybe<Managers_Mutation_Response>;
  /** insert a single row into the table: "managers" */
  insert_managers_one?: Maybe<Managers>;
  /** insert data into the table: "post_comments" */
  insert_post_comments?: Maybe<Post_Comments_Mutation_Response>;
  /** insert a single row into the table: "post_comments" */
  insert_post_comments_one?: Maybe<Post_Comments>;
  /** insert data into the table: "posts" */
  insert_posts?: Maybe<Posts_Mutation_Response>;
  /** insert a single row into the table: "posts" */
  insert_posts_one?: Maybe<Posts>;
  /** insert data into the table: "surrogate_mothers" */
  insert_surrogate_mothers?: Maybe<Surrogate_Mothers_Mutation_Response>;
  /** insert a single row into the table: "surrogate_mothers" */
  insert_surrogate_mothers_one?: Maybe<Surrogate_Mothers>;
  /** insert data into the table: "trust_account_balance_changes" */
  insert_trust_account_balance_changes?: Maybe<Trust_Account_Balance_Changes_Mutation_Response>;
  /** insert a single row into the table: "trust_account_balance_changes" */
  insert_trust_account_balance_changes_one?: Maybe<Trust_Account_Balance_Changes>;
  /** update data of the table: "applications" */
  update_applications?: Maybe<Applications_Mutation_Response>;
  /** update single row of the table: "applications" */
  update_applications_by_pk?: Maybe<Applications>;
  /** update multiples rows of table: "applications" */
  update_applications_many?: Maybe<Array<Maybe<Applications_Mutation_Response>>>;
  /** update data of the table: "cases" */
  update_cases?: Maybe<Cases_Mutation_Response>;
  /** update single row of the table: "cases" */
  update_cases_by_pk?: Maybe<Cases>;
  /** update data of the table: "cases_files" */
  update_cases_files?: Maybe<Cases_Files_Mutation_Response>;
  /** update single row of the table: "cases_files" */
  update_cases_files_by_pk?: Maybe<Cases_Files>;
  /** update multiples rows of table: "cases_files" */
  update_cases_files_many?: Maybe<Array<Maybe<Cases_Files_Mutation_Response>>>;
  /** update multiples rows of table: "cases" */
  update_cases_many?: Maybe<Array<Maybe<Cases_Mutation_Response>>>;
  /** update data of the table: "client_managers" */
  update_client_managers?: Maybe<Client_Managers_Mutation_Response>;
  /** update single row of the table: "client_managers" */
  update_client_managers_by_pk?: Maybe<Client_Managers>;
  /** update multiples rows of table: "client_managers" */
  update_client_managers_many?: Maybe<Array<Maybe<Client_Managers_Mutation_Response>>>;
  /** update data of the table: "intended_parents" */
  update_intended_parents?: Maybe<Intended_Parents_Mutation_Response>;
  /** update single row of the table: "intended_parents" */
  update_intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** update multiples rows of table: "intended_parents" */
  update_intended_parents_many?: Maybe<Array<Maybe<Intended_Parents_Mutation_Response>>>;
  /** update data of the table: "ivf_clinics" */
  update_ivf_clinics?: Maybe<Ivf_Clinics_Mutation_Response>;
  /** update single row of the table: "ivf_clinics" */
  update_ivf_clinics_by_pk?: Maybe<Ivf_Clinics>;
  /** update multiples rows of table: "ivf_clinics" */
  update_ivf_clinics_many?: Maybe<Array<Maybe<Ivf_Clinics_Mutation_Response>>>;
  /** update data of the table: "journeys" */
  update_journeys?: Maybe<Journeys_Mutation_Response>;
  /** update single row of the table: "journeys" */
  update_journeys_by_pk?: Maybe<Journeys>;
  /** update multiples rows of table: "journeys" */
  update_journeys_many?: Maybe<Array<Maybe<Journeys_Mutation_Response>>>;
  /** update data of the table: "managers" */
  update_managers?: Maybe<Managers_Mutation_Response>;
  /** update single row of the table: "managers" */
  update_managers_by_pk?: Maybe<Managers>;
  /** update multiples rows of table: "managers" */
  update_managers_many?: Maybe<Array<Maybe<Managers_Mutation_Response>>>;
  /** update data of the table: "post_comments" */
  update_post_comments?: Maybe<Post_Comments_Mutation_Response>;
  /** update single row of the table: "post_comments" */
  update_post_comments_by_pk?: Maybe<Post_Comments>;
  /** update multiples rows of table: "post_comments" */
  update_post_comments_many?: Maybe<Array<Maybe<Post_Comments_Mutation_Response>>>;
  /** update data of the table: "posts" */
  update_posts?: Maybe<Posts_Mutation_Response>;
  /** update single row of the table: "posts" */
  update_posts_by_pk?: Maybe<Posts>;
  /** update multiples rows of table: "posts" */
  update_posts_many?: Maybe<Array<Maybe<Posts_Mutation_Response>>>;
  /** update data of the table: "surrogate_mothers" */
  update_surrogate_mothers?: Maybe<Surrogate_Mothers_Mutation_Response>;
  /** update single row of the table: "surrogate_mothers" */
  update_surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** update multiples rows of table: "surrogate_mothers" */
  update_surrogate_mothers_many?: Maybe<Array<Maybe<Surrogate_Mothers_Mutation_Response>>>;
  /** update data of the table: "trust_account_balance_changes" */
  update_trust_account_balance_changes?: Maybe<Trust_Account_Balance_Changes_Mutation_Response>;
  /** update single row of the table: "trust_account_balance_changes" */
  update_trust_account_balance_changes_by_pk?: Maybe<Trust_Account_Balance_Changes>;
  /** update multiples rows of table: "trust_account_balance_changes" */
  update_trust_account_balance_changes_many?: Maybe<Array<Maybe<Trust_Account_Balance_Changes_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_ApplicationsArgs = {
  where: Applications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Applications_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CasesArgs = {
  where: Cases_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cases_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cases_FilesArgs = {
  where: Cases_Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cases_Files_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Client_ManagersArgs = {
  where: Client_Managers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Client_Managers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Intended_ParentsArgs = {
  where: Intended_Parents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Intended_Parents_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Ivf_ClinicsArgs = {
  where: Ivf_Clinics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Ivf_Clinics_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_JourneysArgs = {
  where: Journeys_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Journeys_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ManagersArgs = {
  where: Managers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Managers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Post_CommentsArgs = {
  where: Post_Comments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Post_Comments_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_PostsArgs = {
  where: Posts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Posts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Surrogate_MothersArgs = {
  where: Surrogate_Mothers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Surrogate_Mothers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Trust_Account_Balance_ChangesArgs = {
  where: Trust_Account_Balance_Changes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Trust_Account_Balance_Changes_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootInsert_ApplicationsArgs = {
  objects: Array<Applications_Insert_Input>;
  on_conflict?: InputMaybe<Applications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Applications_OneArgs = {
  object: Applications_Insert_Input;
  on_conflict?: InputMaybe<Applications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CasesArgs = {
  objects: Array<Cases_Insert_Input>;
  on_conflict?: InputMaybe<Cases_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cases_FilesArgs = {
  objects: Array<Cases_Files_Insert_Input>;
  on_conflict?: InputMaybe<Cases_Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cases_Files_OneArgs = {
  object: Cases_Files_Insert_Input;
  on_conflict?: InputMaybe<Cases_Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cases_OneArgs = {
  object: Cases_Insert_Input;
  on_conflict?: InputMaybe<Cases_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Client_ManagersArgs = {
  objects: Array<Client_Managers_Insert_Input>;
  on_conflict?: InputMaybe<Client_Managers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Client_Managers_OneArgs = {
  object: Client_Managers_Insert_Input;
  on_conflict?: InputMaybe<Client_Managers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Intended_ParentsArgs = {
  objects: Array<Intended_Parents_Insert_Input>;
  on_conflict?: InputMaybe<Intended_Parents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Intended_Parents_OneArgs = {
  object: Intended_Parents_Insert_Input;
  on_conflict?: InputMaybe<Intended_Parents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Ivf_ClinicsArgs = {
  objects: Array<Ivf_Clinics_Insert_Input>;
  on_conflict?: InputMaybe<Ivf_Clinics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Ivf_Clinics_OneArgs = {
  object: Ivf_Clinics_Insert_Input;
  on_conflict?: InputMaybe<Ivf_Clinics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_JourneysArgs = {
  objects: Array<Journeys_Insert_Input>;
  on_conflict?: InputMaybe<Journeys_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Journeys_OneArgs = {
  object: Journeys_Insert_Input;
  on_conflict?: InputMaybe<Journeys_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ManagersArgs = {
  objects: Array<Managers_Insert_Input>;
  on_conflict?: InputMaybe<Managers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Managers_OneArgs = {
  object: Managers_Insert_Input;
  on_conflict?: InputMaybe<Managers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Post_CommentsArgs = {
  objects: Array<Post_Comments_Insert_Input>;
  on_conflict?: InputMaybe<Post_Comments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Post_Comments_OneArgs = {
  object: Post_Comments_Insert_Input;
  on_conflict?: InputMaybe<Post_Comments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PostsArgs = {
  objects: Array<Posts_Insert_Input>;
  on_conflict?: InputMaybe<Posts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Posts_OneArgs = {
  object: Posts_Insert_Input;
  on_conflict?: InputMaybe<Posts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Surrogate_MothersArgs = {
  objects: Array<Surrogate_Mothers_Insert_Input>;
  on_conflict?: InputMaybe<Surrogate_Mothers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Surrogate_Mothers_OneArgs = {
  object: Surrogate_Mothers_Insert_Input;
  on_conflict?: InputMaybe<Surrogate_Mothers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Trust_Account_Balance_ChangesArgs = {
  objects: Array<Trust_Account_Balance_Changes_Insert_Input>;
  on_conflict?: InputMaybe<Trust_Account_Balance_Changes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Trust_Account_Balance_Changes_OneArgs = {
  object: Trust_Account_Balance_Changes_Insert_Input;
  on_conflict?: InputMaybe<Trust_Account_Balance_Changes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_ApplicationsArgs = {
  _append?: InputMaybe<Applications_Append_Input>;
  _delete_at_path?: InputMaybe<Applications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Applications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Applications_Delete_Key_Input>;
  _inc?: InputMaybe<Applications_Inc_Input>;
  _prepend?: InputMaybe<Applications_Prepend_Input>;
  _set?: InputMaybe<Applications_Set_Input>;
  where: Applications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Applications_By_PkArgs = {
  _append?: InputMaybe<Applications_Append_Input>;
  _delete_at_path?: InputMaybe<Applications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Applications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Applications_Delete_Key_Input>;
  _inc?: InputMaybe<Applications_Inc_Input>;
  _prepend?: InputMaybe<Applications_Prepend_Input>;
  _set?: InputMaybe<Applications_Set_Input>;
  pk_columns: Applications_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Applications_ManyArgs = {
  updates: Array<Applications_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CasesArgs = {
  _inc?: InputMaybe<Cases_Inc_Input>;
  _set?: InputMaybe<Cases_Set_Input>;
  where: Cases_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cases_By_PkArgs = {
  _inc?: InputMaybe<Cases_Inc_Input>;
  _set?: InputMaybe<Cases_Set_Input>;
  pk_columns: Cases_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cases_FilesArgs = {
  _inc?: InputMaybe<Cases_Files_Inc_Input>;
  _set?: InputMaybe<Cases_Files_Set_Input>;
  where: Cases_Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cases_Files_By_PkArgs = {
  _inc?: InputMaybe<Cases_Files_Inc_Input>;
  _set?: InputMaybe<Cases_Files_Set_Input>;
  pk_columns: Cases_Files_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cases_Files_ManyArgs = {
  updates: Array<Cases_Files_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cases_ManyArgs = {
  updates: Array<Cases_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Client_ManagersArgs = {
  _inc?: InputMaybe<Client_Managers_Inc_Input>;
  _set?: InputMaybe<Client_Managers_Set_Input>;
  where: Client_Managers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Client_Managers_By_PkArgs = {
  _inc?: InputMaybe<Client_Managers_Inc_Input>;
  _set?: InputMaybe<Client_Managers_Set_Input>;
  pk_columns: Client_Managers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Client_Managers_ManyArgs = {
  updates: Array<Client_Managers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Intended_ParentsArgs = {
  _append?: InputMaybe<Intended_Parents_Append_Input>;
  _delete_at_path?: InputMaybe<Intended_Parents_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Intended_Parents_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Intended_Parents_Delete_Key_Input>;
  _inc?: InputMaybe<Intended_Parents_Inc_Input>;
  _prepend?: InputMaybe<Intended_Parents_Prepend_Input>;
  _set?: InputMaybe<Intended_Parents_Set_Input>;
  where: Intended_Parents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Intended_Parents_By_PkArgs = {
  _append?: InputMaybe<Intended_Parents_Append_Input>;
  _delete_at_path?: InputMaybe<Intended_Parents_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Intended_Parents_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Intended_Parents_Delete_Key_Input>;
  _inc?: InputMaybe<Intended_Parents_Inc_Input>;
  _prepend?: InputMaybe<Intended_Parents_Prepend_Input>;
  _set?: InputMaybe<Intended_Parents_Set_Input>;
  pk_columns: Intended_Parents_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Intended_Parents_ManyArgs = {
  updates: Array<Intended_Parents_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Ivf_ClinicsArgs = {
  _append?: InputMaybe<Ivf_Clinics_Append_Input>;
  _delete_at_path?: InputMaybe<Ivf_Clinics_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Ivf_Clinics_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Ivf_Clinics_Delete_Key_Input>;
  _inc?: InputMaybe<Ivf_Clinics_Inc_Input>;
  _prepend?: InputMaybe<Ivf_Clinics_Prepend_Input>;
  _set?: InputMaybe<Ivf_Clinics_Set_Input>;
  where: Ivf_Clinics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Ivf_Clinics_By_PkArgs = {
  _append?: InputMaybe<Ivf_Clinics_Append_Input>;
  _delete_at_path?: InputMaybe<Ivf_Clinics_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Ivf_Clinics_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Ivf_Clinics_Delete_Key_Input>;
  _inc?: InputMaybe<Ivf_Clinics_Inc_Input>;
  _prepend?: InputMaybe<Ivf_Clinics_Prepend_Input>;
  _set?: InputMaybe<Ivf_Clinics_Set_Input>;
  pk_columns: Ivf_Clinics_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Ivf_Clinics_ManyArgs = {
  updates: Array<Ivf_Clinics_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_JourneysArgs = {
  _inc?: InputMaybe<Journeys_Inc_Input>;
  _set?: InputMaybe<Journeys_Set_Input>;
  where: Journeys_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Journeys_By_PkArgs = {
  _inc?: InputMaybe<Journeys_Inc_Input>;
  _set?: InputMaybe<Journeys_Set_Input>;
  pk_columns: Journeys_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Journeys_ManyArgs = {
  updates: Array<Journeys_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ManagersArgs = {
  _inc?: InputMaybe<Managers_Inc_Input>;
  _set?: InputMaybe<Managers_Set_Input>;
  where: Managers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Managers_By_PkArgs = {
  _inc?: InputMaybe<Managers_Inc_Input>;
  _set?: InputMaybe<Managers_Set_Input>;
  pk_columns: Managers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Managers_ManyArgs = {
  updates: Array<Managers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Post_CommentsArgs = {
  _inc?: InputMaybe<Post_Comments_Inc_Input>;
  _set?: InputMaybe<Post_Comments_Set_Input>;
  where: Post_Comments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Post_Comments_By_PkArgs = {
  _inc?: InputMaybe<Post_Comments_Inc_Input>;
  _set?: InputMaybe<Post_Comments_Set_Input>;
  pk_columns: Post_Comments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Post_Comments_ManyArgs = {
  updates: Array<Post_Comments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_PostsArgs = {
  _inc?: InputMaybe<Posts_Inc_Input>;
  _set?: InputMaybe<Posts_Set_Input>;
  where: Posts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Posts_By_PkArgs = {
  _inc?: InputMaybe<Posts_Inc_Input>;
  _set?: InputMaybe<Posts_Set_Input>;
  pk_columns: Posts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Posts_ManyArgs = {
  updates: Array<Posts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Surrogate_MothersArgs = {
  _append?: InputMaybe<Surrogate_Mothers_Append_Input>;
  _delete_at_path?: InputMaybe<Surrogate_Mothers_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Surrogate_Mothers_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Surrogate_Mothers_Delete_Key_Input>;
  _inc?: InputMaybe<Surrogate_Mothers_Inc_Input>;
  _prepend?: InputMaybe<Surrogate_Mothers_Prepend_Input>;
  _set?: InputMaybe<Surrogate_Mothers_Set_Input>;
  where: Surrogate_Mothers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Surrogate_Mothers_By_PkArgs = {
  _append?: InputMaybe<Surrogate_Mothers_Append_Input>;
  _delete_at_path?: InputMaybe<Surrogate_Mothers_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Surrogate_Mothers_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Surrogate_Mothers_Delete_Key_Input>;
  _inc?: InputMaybe<Surrogate_Mothers_Inc_Input>;
  _prepend?: InputMaybe<Surrogate_Mothers_Prepend_Input>;
  _set?: InputMaybe<Surrogate_Mothers_Set_Input>;
  pk_columns: Surrogate_Mothers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Surrogate_Mothers_ManyArgs = {
  updates: Array<Surrogate_Mothers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Trust_Account_Balance_ChangesArgs = {
  _inc?: InputMaybe<Trust_Account_Balance_Changes_Inc_Input>;
  _set?: InputMaybe<Trust_Account_Balance_Changes_Set_Input>;
  where: Trust_Account_Balance_Changes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Trust_Account_Balance_Changes_By_PkArgs = {
  _inc?: InputMaybe<Trust_Account_Balance_Changes_Inc_Input>;
  _set?: InputMaybe<Trust_Account_Balance_Changes_Set_Input>;
  pk_columns: Trust_Account_Balance_Changes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Trust_Account_Balance_Changes_ManyArgs = {
  updates: Array<Trust_Account_Balance_Changes_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** 动态评论 */
export type Post_Comments = {
  __typename?: 'post_comments';
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: Maybe<Scalars['String']['output']>;
  /** 评论的内容 */
  content: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  intended_parent?: Maybe<Intended_Parents>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  post?: Maybe<Posts>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  surrogate_mother?: Maybe<Surrogate_Mothers>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "post_comments" */
export type Post_Comments_Aggregate = {
  __typename?: 'post_comments_aggregate';
  aggregate?: Maybe<Post_Comments_Aggregate_Fields>;
  nodes: Array<Post_Comments>;
};

export type Post_Comments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Post_Comments_Aggregate_Bool_Exp_Count>;
};

export type Post_Comments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Post_Comments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Post_Comments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "post_comments" */
export type Post_Comments_Aggregate_Fields = {
  __typename?: 'post_comments_aggregate_fields';
  avg?: Maybe<Post_Comments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Post_Comments_Max_Fields>;
  min?: Maybe<Post_Comments_Min_Fields>;
  stddev?: Maybe<Post_Comments_Stddev_Fields>;
  stddev_pop?: Maybe<Post_Comments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Post_Comments_Stddev_Samp_Fields>;
  sum?: Maybe<Post_Comments_Sum_Fields>;
  var_pop?: Maybe<Post_Comments_Var_Pop_Fields>;
  var_samp?: Maybe<Post_Comments_Var_Samp_Fields>;
  variance?: Maybe<Post_Comments_Variance_Fields>;
};


/** aggregate fields of "post_comments" */
export type Post_Comments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Post_Comments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "post_comments" */
export type Post_Comments_Aggregate_Order_By = {
  avg?: InputMaybe<Post_Comments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Post_Comments_Max_Order_By>;
  min?: InputMaybe<Post_Comments_Min_Order_By>;
  stddev?: InputMaybe<Post_Comments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Post_Comments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Post_Comments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Post_Comments_Sum_Order_By>;
  var_pop?: InputMaybe<Post_Comments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Post_Comments_Var_Samp_Order_By>;
  variance?: InputMaybe<Post_Comments_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "post_comments" */
export type Post_Comments_Arr_Rel_Insert_Input = {
  data: Array<Post_Comments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Post_Comments_On_Conflict>;
};

/** aggregate avg on columns */
export type Post_Comments_Avg_Fields = {
  __typename?: 'post_comments_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "post_comments" */
export type Post_Comments_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "post_comments". All fields are combined with a logical 'AND'. */
export type Post_Comments_Bool_Exp = {
  _and?: InputMaybe<Array<Post_Comments_Bool_Exp>>;
  _not?: InputMaybe<Post_Comments_Bool_Exp>;
  _or?: InputMaybe<Array<Post_Comments_Bool_Exp>>;
  comment_role?: InputMaybe<String_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  intended_parent?: InputMaybe<Intended_Parents_Bool_Exp>;
  intended_parent_intended_parents?: InputMaybe<Bigint_Comparison_Exp>;
  post?: InputMaybe<Posts_Bool_Exp>;
  post_posts?: InputMaybe<Bigint_Comparison_Exp>;
  surrogate_mother?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
  surrogate_mother_surrogate_mothers?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "post_comments" */
export enum Post_Comments_Constraint {
  /** unique or primary key constraint on columns "id" */
  PostCommentsPkey = 'post_comments_pkey'
}

/** input type for incrementing numeric columns in table "post_comments" */
export type Post_Comments_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "post_comments" */
export type Post_Comments_Insert_Input = {
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: InputMaybe<Scalars['String']['input']>;
  /** 评论的内容 */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  intended_parent?: InputMaybe<Intended_Parents_Obj_Rel_Insert_Input>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  post?: InputMaybe<Posts_Obj_Rel_Insert_Input>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Scalars['bigint']['input']>;
  surrogate_mother?: InputMaybe<Surrogate_Mothers_Obj_Rel_Insert_Input>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Post_Comments_Max_Fields = {
  __typename?: 'post_comments_max_fields';
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: Maybe<Scalars['String']['output']>;
  /** 评论的内容 */
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['bigint']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "post_comments" */
export type Post_Comments_Max_Order_By = {
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: InputMaybe<Order_By>;
  /** 评论的内容 */
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Post_Comments_Min_Fields = {
  __typename?: 'post_comments_min_fields';
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: Maybe<Scalars['String']['output']>;
  /** 评论的内容 */
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['bigint']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "post_comments" */
export type Post_Comments_Min_Order_By = {
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: InputMaybe<Order_By>;
  /** 评论的内容 */
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "post_comments" */
export type Post_Comments_Mutation_Response = {
  __typename?: 'post_comments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Post_Comments>;
};

/** on_conflict condition type for table "post_comments" */
export type Post_Comments_On_Conflict = {
  constraint: Post_Comments_Constraint;
  update_columns?: Array<Post_Comments_Update_Column>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};

/** Ordering options when selecting data from "post_comments". */
export type Post_Comments_Order_By = {
  comment_role?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  intended_parent?: InputMaybe<Intended_Parents_Order_By>;
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  post?: InputMaybe<Posts_Order_By>;
  post_posts?: InputMaybe<Order_By>;
  surrogate_mother?: InputMaybe<Surrogate_Mothers_Order_By>;
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: post_comments */
export type Post_Comments_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "post_comments" */
export enum Post_Comments_Select_Column {
  /** column name */
  CommentRole = 'comment_role',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntendedParentIntendedParents = 'intended_parent_intended_parents',
  /** column name */
  PostPosts = 'post_posts',
  /** column name */
  SurrogateMotherSurrogateMothers = 'surrogate_mother_surrogate_mothers',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "post_comments" */
export type Post_Comments_Set_Input = {
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: InputMaybe<Scalars['String']['input']>;
  /** 评论的内容 */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Post_Comments_Stddev_Fields = {
  __typename?: 'post_comments_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "post_comments" */
export type Post_Comments_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Post_Comments_Stddev_Pop_Fields = {
  __typename?: 'post_comments_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "post_comments" */
export type Post_Comments_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Post_Comments_Stddev_Samp_Fields = {
  __typename?: 'post_comments_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "post_comments" */
export type Post_Comments_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "post_comments" */
export type Post_Comments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Post_Comments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Post_Comments_Stream_Cursor_Value_Input = {
  /** 评论的角色：1.intended_parent 2.surrogate_mother */
  comment_role?: InputMaybe<Scalars['String']['input']>;
  /** 评论的内容 */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Scalars['bigint']['input']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Post_Comments_Sum_Fields = {
  __typename?: 'post_comments_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['bigint']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "post_comments" */
export type Post_Comments_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** update columns of table "post_comments" */
export enum Post_Comments_Update_Column {
  /** column name */
  CommentRole = 'comment_role',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntendedParentIntendedParents = 'intended_parent_intended_parents',
  /** column name */
  PostPosts = 'post_posts',
  /** column name */
  SurrogateMotherSurrogateMothers = 'surrogate_mother_surrogate_mothers',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Post_Comments_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Post_Comments_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Post_Comments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Post_Comments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Post_Comments_Var_Pop_Fields = {
  __typename?: 'post_comments_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "post_comments" */
export type Post_Comments_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Post_Comments_Var_Samp_Fields = {
  __typename?: 'post_comments_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "post_comments" */
export type Post_Comments_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Post_Comments_Variance_Fields = {
  __typename?: 'post_comments_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联帖子 */
  post_posts?: Maybe<Scalars['Float']['output']>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "post_comments" */
export type Post_Comments_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 外键，comment_role为intended_parent时关联的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 外键，关联帖子 */
  post_posts?: InputMaybe<Order_By>;
  /** 外键，comment_role为surrogate_mother时关联的代孕母 */
  surrogate_mother_surrogate_mothers?: InputMaybe<Order_By>;
};

/** 动态 */
export type Posts = {
  __typename?: 'posts';
  /** An object relationship */
  case?: Maybe<Cases>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 内容 */
  content: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An array relationship */
  post_comments: Array<Post_Comments>;
  /** An aggregate relationship */
  post_comments_aggregate: Post_Comments_Aggregate;
  /** 标题 */
  title: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 动态 */
export type PostsPost_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


/** 动态 */
export type PostsPost_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};

/** aggregated selection of "posts" */
export type Posts_Aggregate = {
  __typename?: 'posts_aggregate';
  aggregate?: Maybe<Posts_Aggregate_Fields>;
  nodes: Array<Posts>;
};

export type Posts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Posts_Aggregate_Bool_Exp_Count>;
};

export type Posts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Posts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Posts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "posts" */
export type Posts_Aggregate_Fields = {
  __typename?: 'posts_aggregate_fields';
  avg?: Maybe<Posts_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Posts_Max_Fields>;
  min?: Maybe<Posts_Min_Fields>;
  stddev?: Maybe<Posts_Stddev_Fields>;
  stddev_pop?: Maybe<Posts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Posts_Stddev_Samp_Fields>;
  sum?: Maybe<Posts_Sum_Fields>;
  var_pop?: Maybe<Posts_Var_Pop_Fields>;
  var_samp?: Maybe<Posts_Var_Samp_Fields>;
  variance?: Maybe<Posts_Variance_Fields>;
};


/** aggregate fields of "posts" */
export type Posts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Posts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "posts" */
export type Posts_Aggregate_Order_By = {
  avg?: InputMaybe<Posts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Posts_Max_Order_By>;
  min?: InputMaybe<Posts_Min_Order_By>;
  stddev?: InputMaybe<Posts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Posts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Posts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Posts_Sum_Order_By>;
  var_pop?: InputMaybe<Posts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Posts_Var_Samp_Order_By>;
  variance?: InputMaybe<Posts_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "posts" */
export type Posts_Arr_Rel_Insert_Input = {
  data: Array<Posts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Posts_On_Conflict>;
};

/** aggregate avg on columns */
export type Posts_Avg_Fields = {
  __typename?: 'posts_avg_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "posts" */
export type Posts_Avg_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "posts". All fields are combined with a logical 'AND'. */
export type Posts_Bool_Exp = {
  _and?: InputMaybe<Array<Posts_Bool_Exp>>;
  _not?: InputMaybe<Posts_Bool_Exp>;
  _or?: InputMaybe<Array<Posts_Bool_Exp>>;
  case?: InputMaybe<Cases_Bool_Exp>;
  case_cases?: InputMaybe<Bigint_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  post_comments?: InputMaybe<Post_Comments_Bool_Exp>;
  post_comments_aggregate?: InputMaybe<Post_Comments_Aggregate_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "posts" */
export enum Posts_Constraint {
  /** unique or primary key constraint on columns "id" */
  PostsPkey = 'posts_pkey'
}

/** input type for incrementing numeric columns in table "posts" */
export type Posts_Inc_Input = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "posts" */
export type Posts_Insert_Input = {
  case?: InputMaybe<Cases_Obj_Rel_Insert_Input>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 内容 */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  post_comments?: InputMaybe<Post_Comments_Arr_Rel_Insert_Input>;
  /** 标题 */
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Posts_Max_Fields = {
  __typename?: 'posts_max_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 内容 */
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 标题 */
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "posts" */
export type Posts_Max_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 内容 */
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 标题 */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Posts_Min_Fields = {
  __typename?: 'posts_min_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 内容 */
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 标题 */
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "posts" */
export type Posts_Min_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 内容 */
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 标题 */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "posts" */
export type Posts_Mutation_Response = {
  __typename?: 'posts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Posts>;
};

/** input type for inserting object relation for remote table "posts" */
export type Posts_Obj_Rel_Insert_Input = {
  data: Posts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Posts_On_Conflict>;
};

/** on_conflict condition type for table "posts" */
export type Posts_On_Conflict = {
  constraint: Posts_Constraint;
  update_columns?: Array<Posts_Update_Column>;
  where?: InputMaybe<Posts_Bool_Exp>;
};

/** Ordering options when selecting data from "posts". */
export type Posts_Order_By = {
  case?: InputMaybe<Cases_Order_By>;
  case_cases?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  post_comments_aggregate?: InputMaybe<Post_Comments_Aggregate_Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: posts */
export type Posts_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "posts" */
export enum Posts_Select_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "posts" */
export type Posts_Set_Input = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 内容 */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 标题 */
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Posts_Stddev_Fields = {
  __typename?: 'posts_stddev_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "posts" */
export type Posts_Stddev_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Posts_Stddev_Pop_Fields = {
  __typename?: 'posts_stddev_pop_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "posts" */
export type Posts_Stddev_Pop_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Posts_Stddev_Samp_Fields = {
  __typename?: 'posts_stddev_samp_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "posts" */
export type Posts_Stddev_Samp_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "posts" */
export type Posts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Posts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Posts_Stream_Cursor_Value_Input = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 内容 */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 标题 */
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Posts_Sum_Fields = {
  __typename?: 'posts_sum_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "posts" */
export type Posts_Sum_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** update columns of table "posts" */
export enum Posts_Update_Column {
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Posts_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Posts_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Posts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Posts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Posts_Var_Pop_Fields = {
  __typename?: 'posts_var_pop_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "posts" */
export type Posts_Var_Pop_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Posts_Var_Samp_Fields = {
  __typename?: 'posts_var_samp_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "posts" */
export type Posts_Var_Samp_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Posts_Variance_Fields = {
  __typename?: 'posts_variance_fields';
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "posts" */
export type Posts_Variance_Order_By = {
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "applications" */
  applications: Array<Applications>;
  /** fetch aggregated fields from the table: "applications" */
  applications_aggregate: Applications_Aggregate;
  /** fetch data from the table: "applications" using primary key columns */
  applications_by_pk?: Maybe<Applications>;
  /** An array relationship */
  cases: Array<Cases>;
  /** An aggregate relationship */
  cases_aggregate: Cases_Aggregate;
  /** fetch data from the table: "cases" using primary key columns */
  cases_by_pk?: Maybe<Cases>;
  /** An array relationship */
  cases_files: Array<Cases_Files>;
  /** An aggregate relationship */
  cases_files_aggregate: Cases_Files_Aggregate;
  /** fetch data from the table: "cases_files" using primary key columns */
  cases_files_by_pk?: Maybe<Cases_Files>;
  /** fetch data from the table: "client_managers" */
  client_managers: Array<Client_Managers>;
  /** fetch aggregated fields from the table: "client_managers" */
  client_managers_aggregate: Client_Managers_Aggregate;
  /** fetch data from the table: "client_managers" using primary key columns */
  client_managers_by_pk?: Maybe<Client_Managers>;
  /** fetch data from the table: "intended_parents" */
  intended_parents: Array<Intended_Parents>;
  /** fetch aggregated fields from the table: "intended_parents" */
  intended_parents_aggregate: Intended_Parents_Aggregate;
  /** fetch data from the table: "intended_parents" using primary key columns */
  intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** An array relationship */
  ivf_clinics: Array<Ivf_Clinics>;
  /** An aggregate relationship */
  ivf_clinics_aggregate: Ivf_Clinics_Aggregate;
  /** fetch data from the table: "ivf_clinics" using primary key columns */
  ivf_clinics_by_pk?: Maybe<Ivf_Clinics>;
  /** fetch data from the table: "journeys" */
  journeys: Array<Journeys>;
  /** fetch aggregated fields from the table: "journeys" */
  journeys_aggregate: Journeys_Aggregate;
  /** fetch data from the table: "journeys" using primary key columns */
  journeys_by_pk?: Maybe<Journeys>;
  /** fetch data from the table: "managers" */
  managers: Array<Managers>;
  /** fetch aggregated fields from the table: "managers" */
  managers_aggregate: Managers_Aggregate;
  /** fetch data from the table: "managers" using primary key columns */
  managers_by_pk?: Maybe<Managers>;
  /** An array relationship */
  post_comments: Array<Post_Comments>;
  /** An aggregate relationship */
  post_comments_aggregate: Post_Comments_Aggregate;
  /** fetch data from the table: "post_comments" using primary key columns */
  post_comments_by_pk?: Maybe<Post_Comments>;
  /** An array relationship */
  posts: Array<Posts>;
  /** An aggregate relationship */
  posts_aggregate: Posts_Aggregate;
  /** fetch data from the table: "posts" using primary key columns */
  posts_by_pk?: Maybe<Posts>;
  /** fetch data from the table: "surrogate_mothers" */
  surrogate_mothers: Array<Surrogate_Mothers>;
  /** fetch aggregated fields from the table: "surrogate_mothers" */
  surrogate_mothers_aggregate: Surrogate_Mothers_Aggregate;
  /** fetch data from the table: "surrogate_mothers" using primary key columns */
  surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** An array relationship */
  trust_account_balance_changes: Array<Trust_Account_Balance_Changes>;
  /** An aggregate relationship */
  trust_account_balance_changes_aggregate: Trust_Account_Balance_Changes_Aggregate;
  /** fetch data from the table: "trust_account_balance_changes" using primary key columns */
  trust_account_balance_changes_by_pk?: Maybe<Trust_Account_Balance_Changes>;
};


export type Query_RootApplicationsArgs = {
  distinct_on?: InputMaybe<Array<Applications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Applications_Order_By>>;
  where?: InputMaybe<Applications_Bool_Exp>;
};


export type Query_RootApplications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Applications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Applications_Order_By>>;
  where?: InputMaybe<Applications_Bool_Exp>;
};


export type Query_RootApplications_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCasesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


export type Query_RootCases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


export type Query_RootCases_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCases_FilesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


export type Query_RootCases_Files_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


export type Query_RootCases_Files_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootClient_ManagersArgs = {
  distinct_on?: InputMaybe<Array<Client_Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Client_Managers_Order_By>>;
  where?: InputMaybe<Client_Managers_Bool_Exp>;
};


export type Query_RootClient_Managers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Client_Managers_Order_By>>;
  where?: InputMaybe<Client_Managers_Bool_Exp>;
};


export type Query_RootClient_Managers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootIntended_ParentsArgs = {
  distinct_on?: InputMaybe<Array<Intended_Parents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Intended_Parents_Order_By>>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};


export type Query_RootIntended_Parents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Intended_Parents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Intended_Parents_Order_By>>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};


export type Query_RootIntended_Parents_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootIvf_ClinicsArgs = {
  distinct_on?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ivf_Clinics_Order_By>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


export type Query_RootIvf_Clinics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ivf_Clinics_Order_By>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


export type Query_RootIvf_Clinics_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootJourneysArgs = {
  distinct_on?: InputMaybe<Array<Journeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journeys_Order_By>>;
  where?: InputMaybe<Journeys_Bool_Exp>;
};


export type Query_RootJourneys_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journeys_Order_By>>;
  where?: InputMaybe<Journeys_Bool_Exp>;
};


export type Query_RootJourneys_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootManagersArgs = {
  distinct_on?: InputMaybe<Array<Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Managers_Order_By>>;
  where?: InputMaybe<Managers_Bool_Exp>;
};


export type Query_RootManagers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Managers_Order_By>>;
  where?: InputMaybe<Managers_Bool_Exp>;
};


export type Query_RootManagers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPost_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


export type Query_RootPost_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


export type Query_RootPost_Comments_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPostsArgs = {
  distinct_on?: InputMaybe<Array<Posts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Posts_Order_By>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};


export type Query_RootPosts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Posts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Posts_Order_By>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};


export type Query_RootPosts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootSurrogate_MothersArgs = {
  distinct_on?: InputMaybe<Array<Surrogate_Mothers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Surrogate_Mothers_Order_By>>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};


export type Query_RootSurrogate_Mothers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Surrogate_Mothers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Surrogate_Mothers_Order_By>>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};


export type Query_RootSurrogate_Mothers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootTrust_Account_Balance_ChangesArgs = {
  distinct_on?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Trust_Account_Balance_Changes_Order_By>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};


export type Query_RootTrust_Account_Balance_Changes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Trust_Account_Balance_Changes_Order_By>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};


export type Query_RootTrust_Account_Balance_Changes_By_PkArgs = {
  id: Scalars['bigint']['input'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "applications" */
  applications: Array<Applications>;
  /** fetch aggregated fields from the table: "applications" */
  applications_aggregate: Applications_Aggregate;
  /** fetch data from the table: "applications" using primary key columns */
  applications_by_pk?: Maybe<Applications>;
  /** fetch data from the table in a streaming manner: "applications" */
  applications_stream: Array<Applications>;
  /** An array relationship */
  cases: Array<Cases>;
  /** An aggregate relationship */
  cases_aggregate: Cases_Aggregate;
  /** fetch data from the table: "cases" using primary key columns */
  cases_by_pk?: Maybe<Cases>;
  /** An array relationship */
  cases_files: Array<Cases_Files>;
  /** An aggregate relationship */
  cases_files_aggregate: Cases_Files_Aggregate;
  /** fetch data from the table: "cases_files" using primary key columns */
  cases_files_by_pk?: Maybe<Cases_Files>;
  /** fetch data from the table in a streaming manner: "cases_files" */
  cases_files_stream: Array<Cases_Files>;
  /** fetch data from the table in a streaming manner: "cases" */
  cases_stream: Array<Cases>;
  /** fetch data from the table: "client_managers" */
  client_managers: Array<Client_Managers>;
  /** fetch aggregated fields from the table: "client_managers" */
  client_managers_aggregate: Client_Managers_Aggregate;
  /** fetch data from the table: "client_managers" using primary key columns */
  client_managers_by_pk?: Maybe<Client_Managers>;
  /** fetch data from the table in a streaming manner: "client_managers" */
  client_managers_stream: Array<Client_Managers>;
  /** fetch data from the table: "intended_parents" */
  intended_parents: Array<Intended_Parents>;
  /** fetch aggregated fields from the table: "intended_parents" */
  intended_parents_aggregate: Intended_Parents_Aggregate;
  /** fetch data from the table: "intended_parents" using primary key columns */
  intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** fetch data from the table in a streaming manner: "intended_parents" */
  intended_parents_stream: Array<Intended_Parents>;
  /** An array relationship */
  ivf_clinics: Array<Ivf_Clinics>;
  /** An aggregate relationship */
  ivf_clinics_aggregate: Ivf_Clinics_Aggregate;
  /** fetch data from the table: "ivf_clinics" using primary key columns */
  ivf_clinics_by_pk?: Maybe<Ivf_Clinics>;
  /** fetch data from the table in a streaming manner: "ivf_clinics" */
  ivf_clinics_stream: Array<Ivf_Clinics>;
  /** fetch data from the table: "journeys" */
  journeys: Array<Journeys>;
  /** fetch aggregated fields from the table: "journeys" */
  journeys_aggregate: Journeys_Aggregate;
  /** fetch data from the table: "journeys" using primary key columns */
  journeys_by_pk?: Maybe<Journeys>;
  /** fetch data from the table in a streaming manner: "journeys" */
  journeys_stream: Array<Journeys>;
  /** fetch data from the table: "managers" */
  managers: Array<Managers>;
  /** fetch aggregated fields from the table: "managers" */
  managers_aggregate: Managers_Aggregate;
  /** fetch data from the table: "managers" using primary key columns */
  managers_by_pk?: Maybe<Managers>;
  /** fetch data from the table in a streaming manner: "managers" */
  managers_stream: Array<Managers>;
  /** An array relationship */
  post_comments: Array<Post_Comments>;
  /** An aggregate relationship */
  post_comments_aggregate: Post_Comments_Aggregate;
  /** fetch data from the table: "post_comments" using primary key columns */
  post_comments_by_pk?: Maybe<Post_Comments>;
  /** fetch data from the table in a streaming manner: "post_comments" */
  post_comments_stream: Array<Post_Comments>;
  /** An array relationship */
  posts: Array<Posts>;
  /** An aggregate relationship */
  posts_aggregate: Posts_Aggregate;
  /** fetch data from the table: "posts" using primary key columns */
  posts_by_pk?: Maybe<Posts>;
  /** fetch data from the table in a streaming manner: "posts" */
  posts_stream: Array<Posts>;
  /** fetch data from the table: "surrogate_mothers" */
  surrogate_mothers: Array<Surrogate_Mothers>;
  /** fetch aggregated fields from the table: "surrogate_mothers" */
  surrogate_mothers_aggregate: Surrogate_Mothers_Aggregate;
  /** fetch data from the table: "surrogate_mothers" using primary key columns */
  surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** fetch data from the table in a streaming manner: "surrogate_mothers" */
  surrogate_mothers_stream: Array<Surrogate_Mothers>;
  /** An array relationship */
  trust_account_balance_changes: Array<Trust_Account_Balance_Changes>;
  /** An aggregate relationship */
  trust_account_balance_changes_aggregate: Trust_Account_Balance_Changes_Aggregate;
  /** fetch data from the table: "trust_account_balance_changes" using primary key columns */
  trust_account_balance_changes_by_pk?: Maybe<Trust_Account_Balance_Changes>;
  /** fetch data from the table in a streaming manner: "trust_account_balance_changes" */
  trust_account_balance_changes_stream: Array<Trust_Account_Balance_Changes>;
};


export type Subscription_RootApplicationsArgs = {
  distinct_on?: InputMaybe<Array<Applications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Applications_Order_By>>;
  where?: InputMaybe<Applications_Bool_Exp>;
};


export type Subscription_RootApplications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Applications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Applications_Order_By>>;
  where?: InputMaybe<Applications_Bool_Exp>;
};


export type Subscription_RootApplications_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootApplications_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Applications_Stream_Cursor_Input>>;
  where?: InputMaybe<Applications_Bool_Exp>;
};


export type Subscription_RootCasesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


export type Subscription_RootCases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


export type Subscription_RootCases_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCases_FilesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


export type Subscription_RootCases_Files_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Files_Order_By>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


export type Subscription_RootCases_Files_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCases_Files_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cases_Files_Stream_Cursor_Input>>;
  where?: InputMaybe<Cases_Files_Bool_Exp>;
};


export type Subscription_RootCases_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cases_Stream_Cursor_Input>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


export type Subscription_RootClient_ManagersArgs = {
  distinct_on?: InputMaybe<Array<Client_Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Client_Managers_Order_By>>;
  where?: InputMaybe<Client_Managers_Bool_Exp>;
};


export type Subscription_RootClient_Managers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Client_Managers_Order_By>>;
  where?: InputMaybe<Client_Managers_Bool_Exp>;
};


export type Subscription_RootClient_Managers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootClient_Managers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Client_Managers_Stream_Cursor_Input>>;
  where?: InputMaybe<Client_Managers_Bool_Exp>;
};


export type Subscription_RootIntended_ParentsArgs = {
  distinct_on?: InputMaybe<Array<Intended_Parents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Intended_Parents_Order_By>>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};


export type Subscription_RootIntended_Parents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Intended_Parents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Intended_Parents_Order_By>>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};


export type Subscription_RootIntended_Parents_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootIntended_Parents_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Intended_Parents_Stream_Cursor_Input>>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};


export type Subscription_RootIvf_ClinicsArgs = {
  distinct_on?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ivf_Clinics_Order_By>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


export type Subscription_RootIvf_Clinics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ivf_Clinics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ivf_Clinics_Order_By>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


export type Subscription_RootIvf_Clinics_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootIvf_Clinics_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Ivf_Clinics_Stream_Cursor_Input>>;
  where?: InputMaybe<Ivf_Clinics_Bool_Exp>;
};


export type Subscription_RootJourneysArgs = {
  distinct_on?: InputMaybe<Array<Journeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journeys_Order_By>>;
  where?: InputMaybe<Journeys_Bool_Exp>;
};


export type Subscription_RootJourneys_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journeys_Order_By>>;
  where?: InputMaybe<Journeys_Bool_Exp>;
};


export type Subscription_RootJourneys_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootJourneys_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Journeys_Stream_Cursor_Input>>;
  where?: InputMaybe<Journeys_Bool_Exp>;
};


export type Subscription_RootManagersArgs = {
  distinct_on?: InputMaybe<Array<Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Managers_Order_By>>;
  where?: InputMaybe<Managers_Bool_Exp>;
};


export type Subscription_RootManagers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Managers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Managers_Order_By>>;
  where?: InputMaybe<Managers_Bool_Exp>;
};


export type Subscription_RootManagers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootManagers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Managers_Stream_Cursor_Input>>;
  where?: InputMaybe<Managers_Bool_Exp>;
};


export type Subscription_RootPost_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


export type Subscription_RootPost_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


export type Subscription_RootPost_Comments_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPost_Comments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Post_Comments_Stream_Cursor_Input>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


export type Subscription_RootPostsArgs = {
  distinct_on?: InputMaybe<Array<Posts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Posts_Order_By>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};


export type Subscription_RootPosts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Posts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Posts_Order_By>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};


export type Subscription_RootPosts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPosts_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Posts_Stream_Cursor_Input>>;
  where?: InputMaybe<Posts_Bool_Exp>;
};


export type Subscription_RootSurrogate_MothersArgs = {
  distinct_on?: InputMaybe<Array<Surrogate_Mothers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Surrogate_Mothers_Order_By>>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};


export type Subscription_RootSurrogate_Mothers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Surrogate_Mothers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Surrogate_Mothers_Order_By>>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};


export type Subscription_RootSurrogate_Mothers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootSurrogate_Mothers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Surrogate_Mothers_Stream_Cursor_Input>>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};


export type Subscription_RootTrust_Account_Balance_ChangesArgs = {
  distinct_on?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Trust_Account_Balance_Changes_Order_By>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};


export type Subscription_RootTrust_Account_Balance_Changes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Trust_Account_Balance_Changes_Order_By>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};


export type Subscription_RootTrust_Account_Balance_Changes_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootTrust_Account_Balance_Changes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Trust_Account_Balance_Changes_Stream_Cursor_Input>>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};

/** 代孕母表 */
export type Surrogate_Mothers = {
  __typename?: 'surrogate_mothers';
  /** 关于你自己 */
  about_you?: Maybe<Scalars['jsonb']['output']>;
  /** An array relationship */
  cases: Array<Cases>;
  /** An aggregate relationship */
  cases_aggregate: Cases_Aggregate;
  /** 联系方式 */
  contact_information?: Maybe<Scalars['jsonb']['output']>;
  created_at: Scalars['timestamptz']['output'];
  /** 登录的邮箱 */
  email: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  /** 密码 */
  password?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  post_comments: Array<Post_Comments>;
  /** An aggregate relationship */
  post_comments_aggregate: Post_Comments_Aggregate;
  /** 准生育与健康经历 */
  pregnancy_and_health?: Maybe<Scalars['jsonb']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: Maybe<Scalars['jsonb']['output']>;
};


/** 代孕母表 */
export type Surrogate_MothersAbout_YouArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 代孕母表 */
export type Surrogate_MothersCasesArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


/** 代孕母表 */
export type Surrogate_MothersCases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cases_Order_By>>;
  where?: InputMaybe<Cases_Bool_Exp>;
};


/** 代孕母表 */
export type Surrogate_MothersContact_InformationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 代孕母表 */
export type Surrogate_MothersPost_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


/** 代孕母表 */
export type Surrogate_MothersPost_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Post_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Post_Comments_Order_By>>;
  where?: InputMaybe<Post_Comments_Bool_Exp>;
};


/** 代孕母表 */
export type Surrogate_MothersPregnancy_And_HealthArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 代孕母表 */
export type Surrogate_MothersUpload_PhotosArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "surrogate_mothers" */
export type Surrogate_Mothers_Aggregate = {
  __typename?: 'surrogate_mothers_aggregate';
  aggregate?: Maybe<Surrogate_Mothers_Aggregate_Fields>;
  nodes: Array<Surrogate_Mothers>;
};

/** aggregate fields of "surrogate_mothers" */
export type Surrogate_Mothers_Aggregate_Fields = {
  __typename?: 'surrogate_mothers_aggregate_fields';
  avg?: Maybe<Surrogate_Mothers_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Surrogate_Mothers_Max_Fields>;
  min?: Maybe<Surrogate_Mothers_Min_Fields>;
  stddev?: Maybe<Surrogate_Mothers_Stddev_Fields>;
  stddev_pop?: Maybe<Surrogate_Mothers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Surrogate_Mothers_Stddev_Samp_Fields>;
  sum?: Maybe<Surrogate_Mothers_Sum_Fields>;
  var_pop?: Maybe<Surrogate_Mothers_Var_Pop_Fields>;
  var_samp?: Maybe<Surrogate_Mothers_Var_Samp_Fields>;
  variance?: Maybe<Surrogate_Mothers_Variance_Fields>;
};


/** aggregate fields of "surrogate_mothers" */
export type Surrogate_Mothers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Surrogate_Mothers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Surrogate_Mothers_Append_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['jsonb']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Surrogate_Mothers_Avg_Fields = {
  __typename?: 'surrogate_mothers_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "surrogate_mothers". All fields are combined with a logical 'AND'. */
export type Surrogate_Mothers_Bool_Exp = {
  _and?: InputMaybe<Array<Surrogate_Mothers_Bool_Exp>>;
  _not?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
  _or?: InputMaybe<Array<Surrogate_Mothers_Bool_Exp>>;
  about_you?: InputMaybe<Jsonb_Comparison_Exp>;
  cases?: InputMaybe<Cases_Bool_Exp>;
  cases_aggregate?: InputMaybe<Cases_Aggregate_Bool_Exp>;
  contact_information?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  post_comments?: InputMaybe<Post_Comments_Bool_Exp>;
  post_comments_aggregate?: InputMaybe<Post_Comments_Aggregate_Bool_Exp>;
  pregnancy_and_health?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  upload_photos?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "surrogate_mothers" */
export enum Surrogate_Mothers_Constraint {
  /** unique or primary key constraint on columns "email" */
  SurrogateMothersEmailKey = 'surrogate_mothers_email_key',
  /** unique or primary key constraint on columns "id" */
  SurrogateMothersPkey = 'surrogate_mothers_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Surrogate_Mothers_Delete_At_Path_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 联系方式 */
  contact_information?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Array<Scalars['String']['input']>>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Surrogate_Mothers_Delete_Elem_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['Int']['input']>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['Int']['input']>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['Int']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Surrogate_Mothers_Delete_Key_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['String']['input']>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['String']['input']>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['String']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "surrogate_mothers" */
export type Surrogate_Mothers_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "surrogate_mothers" */
export type Surrogate_Mothers_Insert_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['jsonb']['input']>;
  cases?: InputMaybe<Cases_Arr_Rel_Insert_Input>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']['input']>;
  post_comments?: InputMaybe<Post_Comments_Arr_Rel_Insert_Input>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Surrogate_Mothers_Max_Fields = {
  __typename?: 'surrogate_mothers_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 登录的邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 密码 */
  password?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Surrogate_Mothers_Min_Fields = {
  __typename?: 'surrogate_mothers_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 登录的邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 密码 */
  password?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "surrogate_mothers" */
export type Surrogate_Mothers_Mutation_Response = {
  __typename?: 'surrogate_mothers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Surrogate_Mothers>;
};

/** input type for inserting object relation for remote table "surrogate_mothers" */
export type Surrogate_Mothers_Obj_Rel_Insert_Input = {
  data: Surrogate_Mothers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Surrogate_Mothers_On_Conflict>;
};

/** on_conflict condition type for table "surrogate_mothers" */
export type Surrogate_Mothers_On_Conflict = {
  constraint: Surrogate_Mothers_Constraint;
  update_columns?: Array<Surrogate_Mothers_Update_Column>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};

/** Ordering options when selecting data from "surrogate_mothers". */
export type Surrogate_Mothers_Order_By = {
  about_you?: InputMaybe<Order_By>;
  cases_aggregate?: InputMaybe<Cases_Aggregate_Order_By>;
  contact_information?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  post_comments_aggregate?: InputMaybe<Post_Comments_Aggregate_Order_By>;
  pregnancy_and_health?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  upload_photos?: InputMaybe<Order_By>;
};

/** primary key columns input for table: surrogate_mothers */
export type Surrogate_Mothers_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Surrogate_Mothers_Prepend_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['jsonb']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "surrogate_mothers" */
export enum Surrogate_Mothers_Select_Column {
  /** column name */
  AboutYou = 'about_you',
  /** column name */
  ContactInformation = 'contact_information',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  PregnancyAndHealth = 'pregnancy_and_health',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UploadPhotos = 'upload_photos'
}

/** input type for updating data in table "surrogate_mothers" */
export type Surrogate_Mothers_Set_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate stddev on columns */
export type Surrogate_Mothers_Stddev_Fields = {
  __typename?: 'surrogate_mothers_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Surrogate_Mothers_Stddev_Pop_Fields = {
  __typename?: 'surrogate_mothers_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Surrogate_Mothers_Stddev_Samp_Fields = {
  __typename?: 'surrogate_mothers_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "surrogate_mothers" */
export type Surrogate_Mothers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Surrogate_Mothers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Surrogate_Mothers_Stream_Cursor_Value_Input = {
  /** 关于你自己 */
  about_you?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 登录的邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 准生育与健康经历 */
  pregnancy_and_health?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 上传的图片，至少两张 array-jsonb，如：[{"name":"a.png","url":"https://test.com/a.png"}] */
  upload_photos?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Surrogate_Mothers_Sum_Fields = {
  __typename?: 'surrogate_mothers_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "surrogate_mothers" */
export enum Surrogate_Mothers_Update_Column {
  /** column name */
  AboutYou = 'about_you',
  /** column name */
  ContactInformation = 'contact_information',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Password = 'password',
  /** column name */
  PregnancyAndHealth = 'pregnancy_and_health',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UploadPhotos = 'upload_photos'
}

export type Surrogate_Mothers_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Surrogate_Mothers_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Surrogate_Mothers_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Surrogate_Mothers_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Surrogate_Mothers_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Surrogate_Mothers_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Surrogate_Mothers_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Surrogate_Mothers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Surrogate_Mothers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Surrogate_Mothers_Var_Pop_Fields = {
  __typename?: 'surrogate_mothers_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Surrogate_Mothers_Var_Samp_Fields = {
  __typename?: 'surrogate_mothers_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Surrogate_Mothers_Variance_Fields = {
  __typename?: 'surrogate_mothers_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** 信托账户余额变动记录 */
export type Trust_Account_Balance_Changes = {
  __typename?: 'trust_account_balance_changes';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['numeric']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['numeric']['output']>;
  /** 外键，关联case */
  case_cases: Scalars['bigint']['output'];
  /** 变动金额 */
  change_amount: Scalars['numeric']['output'];
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  intended_parent: Intended_Parents;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents: Scalars['bigint']['output'];
  /** 备注 */
  remark?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Aggregate = {
  __typename?: 'trust_account_balance_changes_aggregate';
  aggregate?: Maybe<Trust_Account_Balance_Changes_Aggregate_Fields>;
  nodes: Array<Trust_Account_Balance_Changes>;
};

export type Trust_Account_Balance_Changes_Aggregate_Bool_Exp = {
  count?: InputMaybe<Trust_Account_Balance_Changes_Aggregate_Bool_Exp_Count>;
};

export type Trust_Account_Balance_Changes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Aggregate_Fields = {
  __typename?: 'trust_account_balance_changes_aggregate_fields';
  avg?: Maybe<Trust_Account_Balance_Changes_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Trust_Account_Balance_Changes_Max_Fields>;
  min?: Maybe<Trust_Account_Balance_Changes_Min_Fields>;
  stddev?: Maybe<Trust_Account_Balance_Changes_Stddev_Fields>;
  stddev_pop?: Maybe<Trust_Account_Balance_Changes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Trust_Account_Balance_Changes_Stddev_Samp_Fields>;
  sum?: Maybe<Trust_Account_Balance_Changes_Sum_Fields>;
  var_pop?: Maybe<Trust_Account_Balance_Changes_Var_Pop_Fields>;
  var_samp?: Maybe<Trust_Account_Balance_Changes_Var_Samp_Fields>;
  variance?: Maybe<Trust_Account_Balance_Changes_Variance_Fields>;
};


/** aggregate fields of "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Trust_Account_Balance_Changes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Aggregate_Order_By = {
  avg?: InputMaybe<Trust_Account_Balance_Changes_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Trust_Account_Balance_Changes_Max_Order_By>;
  min?: InputMaybe<Trust_Account_Balance_Changes_Min_Order_By>;
  stddev?: InputMaybe<Trust_Account_Balance_Changes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Trust_Account_Balance_Changes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Trust_Account_Balance_Changes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Trust_Account_Balance_Changes_Sum_Order_By>;
  var_pop?: InputMaybe<Trust_Account_Balance_Changes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Trust_Account_Balance_Changes_Var_Samp_Order_By>;
  variance?: InputMaybe<Trust_Account_Balance_Changes_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Arr_Rel_Insert_Input = {
  data: Array<Trust_Account_Balance_Changes_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Trust_Account_Balance_Changes_On_Conflict>;
};

/** aggregate avg on columns */
export type Trust_Account_Balance_Changes_Avg_Fields = {
  __typename?: 'trust_account_balance_changes_avg_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Avg_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "trust_account_balance_changes". All fields are combined with a logical 'AND'. */
export type Trust_Account_Balance_Changes_Bool_Exp = {
  _and?: InputMaybe<Array<Trust_Account_Balance_Changes_Bool_Exp>>;
  _not?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
  _or?: InputMaybe<Array<Trust_Account_Balance_Changes_Bool_Exp>>;
  balance_after?: InputMaybe<Numeric_Comparison_Exp>;
  balance_before?: InputMaybe<Numeric_Comparison_Exp>;
  case_cases?: InputMaybe<Bigint_Comparison_Exp>;
  change_amount?: InputMaybe<Numeric_Comparison_Exp>;
  change_type?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  intended_parent?: InputMaybe<Intended_Parents_Bool_Exp>;
  intended_parent_intended_parents?: InputMaybe<Bigint_Comparison_Exp>;
  remark?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "trust_account_balance_changes" */
export enum Trust_Account_Balance_Changes_Constraint {
  /** unique or primary key constraint on columns "id" */
  TrustAccountBalanceChangesPkey = 'trust_account_balance_changes_pkey'
}

/** input type for incrementing numeric columns in table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Inc_Input = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Scalars['numeric']['input']>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 变动金额 */
  change_amount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Insert_Input = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Scalars['numeric']['input']>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 变动金额 */
  change_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  intended_parent?: InputMaybe<Intended_Parents_Obj_Rel_Insert_Input>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Trust_Account_Balance_Changes_Max_Fields = {
  __typename?: 'trust_account_balance_changes_max_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['numeric']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['numeric']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['numeric']['output']>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 备注 */
  remark?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Max_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 备注 */
  remark?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Trust_Account_Balance_Changes_Min_Fields = {
  __typename?: 'trust_account_balance_changes_min_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['numeric']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['numeric']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['numeric']['output']>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
  /** 备注 */
  remark?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Min_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  /** 备注 */
  remark?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Mutation_Response = {
  __typename?: 'trust_account_balance_changes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Trust_Account_Balance_Changes>;
};

/** on_conflict condition type for table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_On_Conflict = {
  constraint: Trust_Account_Balance_Changes_Constraint;
  update_columns?: Array<Trust_Account_Balance_Changes_Update_Column>;
  where?: InputMaybe<Trust_Account_Balance_Changes_Bool_Exp>;
};

/** Ordering options when selecting data from "trust_account_balance_changes". */
export type Trust_Account_Balance_Changes_Order_By = {
  balance_after?: InputMaybe<Order_By>;
  balance_before?: InputMaybe<Order_By>;
  case_cases?: InputMaybe<Order_By>;
  change_amount?: InputMaybe<Order_By>;
  change_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  intended_parent?: InputMaybe<Intended_Parents_Order_By>;
  intended_parent_intended_parents?: InputMaybe<Order_By>;
  remark?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: trust_account_balance_changes */
export type Trust_Account_Balance_Changes_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "trust_account_balance_changes" */
export enum Trust_Account_Balance_Changes_Select_Column {
  /** column name */
  BalanceAfter = 'balance_after',
  /** column name */
  BalanceBefore = 'balance_before',
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  ChangeAmount = 'change_amount',
  /** column name */
  ChangeType = 'change_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntendedParentIntendedParents = 'intended_parent_intended_parents',
  /** column name */
  Remark = 'remark',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Set_Input = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Scalars['numeric']['input']>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 变动金额 */
  change_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Trust_Account_Balance_Changes_Stddev_Fields = {
  __typename?: 'trust_account_balance_changes_stddev_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Stddev_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Trust_Account_Balance_Changes_Stddev_Pop_Fields = {
  __typename?: 'trust_account_balance_changes_stddev_pop_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Stddev_Pop_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Trust_Account_Balance_Changes_Stddev_Samp_Fields = {
  __typename?: 'trust_account_balance_changes_stddev_samp_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Stddev_Samp_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Trust_Account_Balance_Changes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Trust_Account_Balance_Changes_Stream_Cursor_Value_Input = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Scalars['numeric']['input']>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Scalars['bigint']['input']>;
  /** 变动金额 */
  change_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 变动类型：1. RECHARGE 2. CONSUMPTION 3. OTHER */
  change_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Scalars['bigint']['input']>;
  /** 备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Trust_Account_Balance_Changes_Sum_Fields = {
  __typename?: 'trust_account_balance_changes_sum_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['numeric']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['numeric']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['bigint']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Sum_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** update columns of table "trust_account_balance_changes" */
export enum Trust_Account_Balance_Changes_Update_Column {
  /** column name */
  BalanceAfter = 'balance_after',
  /** column name */
  BalanceBefore = 'balance_before',
  /** column name */
  CaseCases = 'case_cases',
  /** column name */
  ChangeAmount = 'change_amount',
  /** column name */
  ChangeType = 'change_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntendedParentIntendedParents = 'intended_parent_intended_parents',
  /** column name */
  Remark = 'remark',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Trust_Account_Balance_Changes_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Trust_Account_Balance_Changes_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Trust_Account_Balance_Changes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Trust_Account_Balance_Changes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Trust_Account_Balance_Changes_Var_Pop_Fields = {
  __typename?: 'trust_account_balance_changes_var_pop_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Var_Pop_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Trust_Account_Balance_Changes_Var_Samp_Fields = {
  __typename?: 'trust_account_balance_changes_var_samp_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Var_Samp_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Trust_Account_Balance_Changes_Variance_Fields = {
  __typename?: 'trust_account_balance_changes_variance_fields';
  /** 变动后的余额 */
  balance_after?: Maybe<Scalars['Float']['output']>;
  /** 变动前的余额 */
  balance_before?: Maybe<Scalars['Float']['output']>;
  /** 外键，关联case */
  case_cases?: Maybe<Scalars['Float']['output']>;
  /** 变动金额 */
  change_amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "trust_account_balance_changes" */
export type Trust_Account_Balance_Changes_Variance_Order_By = {
  /** 变动后的余额 */
  balance_after?: InputMaybe<Order_By>;
  /** 变动前的余额 */
  balance_before?: InputMaybe<Order_By>;
  /** 外键，关联case */
  case_cases?: InputMaybe<Order_By>;
  /** 变动金额 */
  change_amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联外键，对应的准父母 */
  intended_parent_intended_parents?: InputMaybe<Order_By>;
};
