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
  content?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
  user_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "cases" */
export type Cases_Aggregate = {
  __typename?: 'cases_aggregate';
  aggregate?: Maybe<Cases_Aggregate_Fields>;
  nodes: Array<Cases>;
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

/** aggregate avg on columns */
export type Cases_Avg_Fields = {
  __typename?: 'cases_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cases". All fields are combined with a logical 'AND'. */
export type Cases_Bool_Exp = {
  _and?: InputMaybe<Array<Cases_Bool_Exp>>;
  _not?: InputMaybe<Cases_Bool_Exp>;
  _or?: InputMaybe<Array<Cases_Bool_Exp>>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "cases" */
export enum Cases_Constraint {
  /** unique or primary key constraint on columns "id" */
  CasesPkey = 'cases_pkey'
}

/** input type for incrementing numeric columns in table "cases" */
export type Cases_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  user_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "cases" */
export type Cases_Insert_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Cases_Max_Fields = {
  __typename?: 'cases_max_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Cases_Min_Fields = {
  __typename?: 'cases_min_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['bigint']['output']>;
};

/** response of any mutation on the table "cases" */
export type Cases_Mutation_Response = {
  __typename?: 'cases_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cases>;
};

/** on_conflict condition type for table "cases" */
export type Cases_On_Conflict = {
  constraint: Cases_Constraint;
  update_columns?: Array<Cases_Update_Column>;
  where?: InputMaybe<Cases_Bool_Exp>;
};

/** Ordering options when selecting data from "cases". */
export type Cases_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cases */
export type Cases_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "cases" */
export enum Cases_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "cases" */
export type Cases_Set_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Cases_Stddev_Fields = {
  __typename?: 'cases_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cases_Stddev_Pop_Fields = {
  __typename?: 'cases_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cases_Stddev_Samp_Fields = {
  __typename?: 'cases_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
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
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Cases_Sum_Fields = {
  __typename?: 'cases_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  user_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "cases" */
export enum Cases_Update_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
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
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cases_Var_Samp_Fields = {
  __typename?: 'cases_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cases_Variance_Fields = {
  __typename?: 'cases_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
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
  /** 联系信息 */
  contact_information?: Maybe<Scalars['jsonb']['output']>;
  created_at: Scalars['timestamptz']['output'];
  /** 家庭资料 */
  family_profile?: Maybe<Scalars['jsonb']['output']>;
  id: Scalars['bigint']['output'];
  /** 项目意向 */
  program_interests?: Maybe<Scalars['jsonb']['output']>;
  /** 渠道及初步沟通 */
  referral?: Maybe<Scalars['jsonb']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};


/** 准父母表 */
export type Intended_ParentsBasic_InformationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
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
export type Intended_ParentsProgram_InterestsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** 准父母表 */
export type Intended_ParentsReferralArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
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
};

/** Boolean expression to filter rows from the table "intended_parents". All fields are combined with a logical 'AND'. */
export type Intended_Parents_Bool_Exp = {
  _and?: InputMaybe<Array<Intended_Parents_Bool_Exp>>;
  _not?: InputMaybe<Intended_Parents_Bool_Exp>;
  _or?: InputMaybe<Array<Intended_Parents_Bool_Exp>>;
  basic_information?: InputMaybe<Jsonb_Comparison_Exp>;
  contact_information?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  family_profile?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  program_interests?: InputMaybe<Jsonb_Comparison_Exp>;
  referral?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "intended_parents" */
export enum Intended_Parents_Constraint {
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
};

/** input type for inserting data into table "intended_parents" */
export type Intended_Parents_Insert_Input = {
  /** 基本信息 */
  basic_information?: InputMaybe<Scalars['jsonb']['input']>;
  /** 联系信息 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Intended_Parents_Max_Fields = {
  __typename?: 'intended_parents_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Intended_Parents_Min_Fields = {
  __typename?: 'intended_parents_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
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

/** on_conflict condition type for table "intended_parents" */
export type Intended_Parents_On_Conflict = {
  constraint: Intended_Parents_Constraint;
  update_columns?: Array<Intended_Parents_Update_Column>;
  where?: InputMaybe<Intended_Parents_Bool_Exp>;
};

/** Ordering options when selecting data from "intended_parents". */
export type Intended_Parents_Order_By = {
  basic_information?: InputMaybe<Order_By>;
  contact_information?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  family_profile?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  program_interests?: InputMaybe<Order_By>;
  referral?: InputMaybe<Order_By>;
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
  FamilyProfile = 'family_profile',
  /** column name */
  Id = 'id',
  /** column name */
  ProgramInterests = 'program_interests',
  /** column name */
  Referral = 'referral',
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
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Intended_Parents_Stddev_Fields = {
  __typename?: 'intended_parents_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Intended_Parents_Stddev_Pop_Fields = {
  __typename?: 'intended_parents_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Intended_Parents_Stddev_Samp_Fields = {
  __typename?: 'intended_parents_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
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
  /** 家庭资料 */
  family_profile?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 项目意向 */
  program_interests?: InputMaybe<Scalars['jsonb']['input']>;
  /** 渠道及初步沟通 */
  referral?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Intended_Parents_Sum_Fields = {
  __typename?: 'intended_parents_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
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
  FamilyProfile = 'family_profile',
  /** column name */
  Id = 'id',
  /** column name */
  ProgramInterests = 'program_interests',
  /** column name */
  Referral = 'referral',
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
};

/** aggregate var_samp on columns */
export type Intended_Parents_Var_Samp_Fields = {
  __typename?: 'intended_parents_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Intended_Parents_Variance_Fields = {
  __typename?: 'intended_parents_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
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
  /** delete data from the table: "intended_parents" */
  delete_intended_parents?: Maybe<Intended_Parents_Mutation_Response>;
  /** delete single row from the table: "intended_parents" */
  delete_intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** delete data from the table: "surrogate_mothers" */
  delete_surrogate_mothers?: Maybe<Surrogate_Mothers_Mutation_Response>;
  /** delete single row from the table: "surrogate_mothers" */
  delete_surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** delete data from the table: "user_notifications" */
  delete_user_notifications?: Maybe<User_Notifications_Mutation_Response>;
  /** delete single row from the table: "user_notifications" */
  delete_user_notifications_by_pk?: Maybe<User_Notifications>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "applications" */
  insert_applications?: Maybe<Applications_Mutation_Response>;
  /** insert a single row into the table: "applications" */
  insert_applications_one?: Maybe<Applications>;
  /** insert data into the table: "cases" */
  insert_cases?: Maybe<Cases_Mutation_Response>;
  /** insert a single row into the table: "cases" */
  insert_cases_one?: Maybe<Cases>;
  /** insert data into the table: "intended_parents" */
  insert_intended_parents?: Maybe<Intended_Parents_Mutation_Response>;
  /** insert a single row into the table: "intended_parents" */
  insert_intended_parents_one?: Maybe<Intended_Parents>;
  /** insert data into the table: "surrogate_mothers" */
  insert_surrogate_mothers?: Maybe<Surrogate_Mothers_Mutation_Response>;
  /** insert a single row into the table: "surrogate_mothers" */
  insert_surrogate_mothers_one?: Maybe<Surrogate_Mothers>;
  /** insert data into the table: "user_notifications" */
  insert_user_notifications?: Maybe<User_Notifications_Mutation_Response>;
  /** insert a single row into the table: "user_notifications" */
  insert_user_notifications_one?: Maybe<User_Notifications>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
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
  /** update multiples rows of table: "cases" */
  update_cases_many?: Maybe<Array<Maybe<Cases_Mutation_Response>>>;
  /** update data of the table: "intended_parents" */
  update_intended_parents?: Maybe<Intended_Parents_Mutation_Response>;
  /** update single row of the table: "intended_parents" */
  update_intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** update multiples rows of table: "intended_parents" */
  update_intended_parents_many?: Maybe<Array<Maybe<Intended_Parents_Mutation_Response>>>;
  /** update data of the table: "surrogate_mothers" */
  update_surrogate_mothers?: Maybe<Surrogate_Mothers_Mutation_Response>;
  /** update single row of the table: "surrogate_mothers" */
  update_surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** update multiples rows of table: "surrogate_mothers" */
  update_surrogate_mothers_many?: Maybe<Array<Maybe<Surrogate_Mothers_Mutation_Response>>>;
  /** update data of the table: "user_notifications" */
  update_user_notifications?: Maybe<User_Notifications_Mutation_Response>;
  /** update single row of the table: "user_notifications" */
  update_user_notifications_by_pk?: Maybe<User_Notifications>;
  /** update multiples rows of table: "user_notifications" */
  update_user_notifications_many?: Maybe<Array<Maybe<User_Notifications_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
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
export type Mutation_RootDelete_Intended_ParentsArgs = {
  where: Intended_Parents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Intended_Parents_By_PkArgs = {
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
export type Mutation_RootDelete_User_NotificationsArgs = {
  where: User_Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Notifications_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
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
export type Mutation_RootInsert_Cases_OneArgs = {
  object: Cases_Insert_Input;
  on_conflict?: InputMaybe<Cases_On_Conflict>;
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
export type Mutation_RootInsert_User_NotificationsArgs = {
  objects: Array<User_Notifications_Insert_Input>;
  on_conflict?: InputMaybe<User_Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Notifications_OneArgs = {
  object: User_Notifications_Insert_Input;
  on_conflict?: InputMaybe<User_Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
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
export type Mutation_RootUpdate_Cases_ManyArgs = {
  updates: Array<Cases_Updates>;
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
export type Mutation_RootUpdate_User_NotificationsArgs = {
  _inc?: InputMaybe<User_Notifications_Inc_Input>;
  _set?: InputMaybe<User_Notifications_Set_Input>;
  where: User_Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Notifications_By_PkArgs = {
  _inc?: InputMaybe<User_Notifications_Inc_Input>;
  _set?: InputMaybe<User_Notifications_Set_Input>;
  pk_columns: User_Notifications_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Notifications_ManyArgs = {
  updates: Array<User_Notifications_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
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

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "applications" */
  applications: Array<Applications>;
  /** fetch aggregated fields from the table: "applications" */
  applications_aggregate: Applications_Aggregate;
  /** fetch data from the table: "applications" using primary key columns */
  applications_by_pk?: Maybe<Applications>;
  /** fetch data from the table: "cases" */
  cases: Array<Cases>;
  /** fetch aggregated fields from the table: "cases" */
  cases_aggregate: Cases_Aggregate;
  /** fetch data from the table: "cases" using primary key columns */
  cases_by_pk?: Maybe<Cases>;
  /** fetch data from the table: "intended_parents" */
  intended_parents: Array<Intended_Parents>;
  /** fetch aggregated fields from the table: "intended_parents" */
  intended_parents_aggregate: Intended_Parents_Aggregate;
  /** fetch data from the table: "intended_parents" using primary key columns */
  intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** fetch data from the table: "surrogate_mothers" */
  surrogate_mothers: Array<Surrogate_Mothers>;
  /** fetch aggregated fields from the table: "surrogate_mothers" */
  surrogate_mothers_aggregate: Surrogate_Mothers_Aggregate;
  /** fetch data from the table: "surrogate_mothers" using primary key columns */
  surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** An array relationship */
  user_notifications: Array<User_Notifications>;
  /** An aggregate relationship */
  user_notifications_aggregate: User_Notifications_Aggregate;
  /** fetch data from the table: "user_notifications" using primary key columns */
  user_notifications_by_pk?: Maybe<User_Notifications>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
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


export type Query_RootUser_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<User_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Notifications_Order_By>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};


export type Query_RootUser_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Notifications_Order_By>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};


export type Query_RootUser_Notifications_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
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
  /** fetch data from the table: "cases" */
  cases: Array<Cases>;
  /** fetch aggregated fields from the table: "cases" */
  cases_aggregate: Cases_Aggregate;
  /** fetch data from the table: "cases" using primary key columns */
  cases_by_pk?: Maybe<Cases>;
  /** fetch data from the table in a streaming manner: "cases" */
  cases_stream: Array<Cases>;
  /** fetch data from the table: "intended_parents" */
  intended_parents: Array<Intended_Parents>;
  /** fetch aggregated fields from the table: "intended_parents" */
  intended_parents_aggregate: Intended_Parents_Aggregate;
  /** fetch data from the table: "intended_parents" using primary key columns */
  intended_parents_by_pk?: Maybe<Intended_Parents>;
  /** fetch data from the table in a streaming manner: "intended_parents" */
  intended_parents_stream: Array<Intended_Parents>;
  /** fetch data from the table: "surrogate_mothers" */
  surrogate_mothers: Array<Surrogate_Mothers>;
  /** fetch aggregated fields from the table: "surrogate_mothers" */
  surrogate_mothers_aggregate: Surrogate_Mothers_Aggregate;
  /** fetch data from the table: "surrogate_mothers" using primary key columns */
  surrogate_mothers_by_pk?: Maybe<Surrogate_Mothers>;
  /** fetch data from the table in a streaming manner: "surrogate_mothers" */
  surrogate_mothers_stream: Array<Surrogate_Mothers>;
  /** An array relationship */
  user_notifications: Array<User_Notifications>;
  /** An aggregate relationship */
  user_notifications_aggregate: User_Notifications_Aggregate;
  /** fetch data from the table: "user_notifications" using primary key columns */
  user_notifications_by_pk?: Maybe<User_Notifications>;
  /** fetch data from the table in a streaming manner: "user_notifications" */
  user_notifications_stream: Array<User_Notifications>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
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


export type Subscription_RootCases_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cases_Stream_Cursor_Input>>;
  where?: InputMaybe<Cases_Bool_Exp>;
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


export type Subscription_RootUser_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<User_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Notifications_Order_By>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};


export type Subscription_RootUser_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Notifications_Order_By>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};


export type Subscription_RootUser_Notifications_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootUser_Notifications_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Notifications_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** 代孕母表 */
export type Surrogate_Mothers = {
  __typename?: 'surrogate_mothers';
  /** 关于你自己 */
  about_you?: Maybe<Scalars['jsonb']['output']>;
  /** 联系方式 */
  contact_information?: Maybe<Scalars['jsonb']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
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
export type Surrogate_MothersContact_InformationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
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
  contact_information?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  pregnancy_and_health?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  upload_photos?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "surrogate_mothers" */
export enum Surrogate_Mothers_Constraint {
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
  /** 联系方式 */
  contact_information?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
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
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Surrogate_Mothers_Min_Fields = {
  __typename?: 'surrogate_mothers_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
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

/** on_conflict condition type for table "surrogate_mothers" */
export type Surrogate_Mothers_On_Conflict = {
  constraint: Surrogate_Mothers_Constraint;
  update_columns?: Array<Surrogate_Mothers_Update_Column>;
  where?: InputMaybe<Surrogate_Mothers_Bool_Exp>;
};

/** Ordering options when selecting data from "surrogate_mothers". */
export type Surrogate_Mothers_Order_By = {
  about_you?: InputMaybe<Order_By>;
  contact_information?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
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
  Id = 'id',
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
  id?: InputMaybe<Scalars['bigint']['input']>;
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
  id?: InputMaybe<Scalars['bigint']['input']>;
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
  Id = 'id',
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

/** 用户通知 */
export type User_Notifications = {
  __typename?: 'user_notifications';
  content?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "user_notifications" */
export type User_Notifications_Aggregate = {
  __typename?: 'user_notifications_aggregate';
  aggregate?: Maybe<User_Notifications_Aggregate_Fields>;
  nodes: Array<User_Notifications>;
};

export type User_Notifications_Aggregate_Bool_Exp = {
  count?: InputMaybe<User_Notifications_Aggregate_Bool_Exp_Count>;
};

export type User_Notifications_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<User_Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<User_Notifications_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "user_notifications" */
export type User_Notifications_Aggregate_Fields = {
  __typename?: 'user_notifications_aggregate_fields';
  avg?: Maybe<User_Notifications_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<User_Notifications_Max_Fields>;
  min?: Maybe<User_Notifications_Min_Fields>;
  stddev?: Maybe<User_Notifications_Stddev_Fields>;
  stddev_pop?: Maybe<User_Notifications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Notifications_Stddev_Samp_Fields>;
  sum?: Maybe<User_Notifications_Sum_Fields>;
  var_pop?: Maybe<User_Notifications_Var_Pop_Fields>;
  var_samp?: Maybe<User_Notifications_Var_Samp_Fields>;
  variance?: Maybe<User_Notifications_Variance_Fields>;
};


/** aggregate fields of "user_notifications" */
export type User_Notifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "user_notifications" */
export type User_Notifications_Aggregate_Order_By = {
  avg?: InputMaybe<User_Notifications_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Notifications_Max_Order_By>;
  min?: InputMaybe<User_Notifications_Min_Order_By>;
  stddev?: InputMaybe<User_Notifications_Stddev_Order_By>;
  stddev_pop?: InputMaybe<User_Notifications_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<User_Notifications_Stddev_Samp_Order_By>;
  sum?: InputMaybe<User_Notifications_Sum_Order_By>;
  var_pop?: InputMaybe<User_Notifications_Var_Pop_Order_By>;
  var_samp?: InputMaybe<User_Notifications_Var_Samp_Order_By>;
  variance?: InputMaybe<User_Notifications_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "user_notifications" */
export type User_Notifications_Arr_Rel_Insert_Input = {
  data: Array<User_Notifications_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<User_Notifications_On_Conflict>;
};

/** aggregate avg on columns */
export type User_Notifications_Avg_Fields = {
  __typename?: 'user_notifications_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "user_notifications" */
export type User_Notifications_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "user_notifications". All fields are combined with a logical 'AND'. */
export type User_Notifications_Bool_Exp = {
  _and?: InputMaybe<Array<User_Notifications_Bool_Exp>>;
  _not?: InputMaybe<User_Notifications_Bool_Exp>;
  _or?: InputMaybe<Array<User_Notifications_Bool_Exp>>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_users?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_notifications" */
export enum User_Notifications_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserNotificationsPkey = 'user_notifications_pkey'
}

/** input type for incrementing numeric columns in table "user_notifications" */
export type User_Notifications_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "user_notifications" */
export type User_Notifications_Insert_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type User_Notifications_Max_Fields = {
  __typename?: 'user_notifications_max_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "user_notifications" */
export type User_Notifications_Max_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Notifications_Min_Fields = {
  __typename?: 'user_notifications_min_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "user_notifications" */
export type User_Notifications_Min_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_notifications" */
export type User_Notifications_Mutation_Response = {
  __typename?: 'user_notifications_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Notifications>;
};

/** on_conflict condition type for table "user_notifications" */
export type User_Notifications_On_Conflict = {
  constraint: User_Notifications_Constraint;
  update_columns?: Array<User_Notifications_Update_Column>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};

/** Ordering options when selecting data from "user_notifications". */
export type User_Notifications_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_notifications */
export type User_Notifications_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "user_notifications" */
export enum User_Notifications_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

/** input type for updating data in table "user_notifications" */
export type User_Notifications_Set_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type User_Notifications_Stddev_Fields = {
  __typename?: 'user_notifications_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "user_notifications" */
export type User_Notifications_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type User_Notifications_Stddev_Pop_Fields = {
  __typename?: 'user_notifications_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "user_notifications" */
export type User_Notifications_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type User_Notifications_Stddev_Samp_Fields = {
  __typename?: 'user_notifications_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "user_notifications" */
export type User_Notifications_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "user_notifications" */
export type User_Notifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Notifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Notifications_Stream_Cursor_Value_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type User_Notifications_Sum_Fields = {
  __typename?: 'user_notifications_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "user_notifications" */
export type User_Notifications_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** update columns of table "user_notifications" */
export enum User_Notifications_Update_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

export type User_Notifications_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<User_Notifications_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Notifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Notifications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type User_Notifications_Var_Pop_Fields = {
  __typename?: 'user_notifications_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "user_notifications" */
export type User_Notifications_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type User_Notifications_Var_Samp_Fields = {
  __typename?: 'user_notifications_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "user_notifications" */
export type User_Notifications_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type User_Notifications_Variance_Fields = {
  __typename?: 'user_notifications_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "user_notifications" */
export type User_Notifications_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** 用户表 */
export type Users = {
  __typename?: 'users';
  created_at: Scalars['timestamptz']['output'];
  /** 邮箱 */
  email: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  /** An array relationship */
  user_notifications: Array<User_Notifications>;
  /** An aggregate relationship */
  user_notifications_aggregate: User_Notifications_Aggregate;
};


/** 用户表 */
export type UsersUser_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<User_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Notifications_Order_By>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};


/** 用户表 */
export type UsersUser_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Notifications_Order_By>>;
  where?: InputMaybe<User_Notifications_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  avg?: Maybe<Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: 'users_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_notifications?: InputMaybe<User_Notifications_Bool_Exp>;
  user_notifications_aggregate?: InputMaybe<User_Notifications_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** input type for incrementing numeric columns in table "users" */
export type Users_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_notifications?: InputMaybe<User_Notifications_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 邮箱 */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_notifications_aggregate?: InputMaybe<User_Notifications_Aggregate_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Phone = 'phone',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: 'users_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: 'users_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: 'users_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 邮箱 */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: 'users_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Phone = 'phone',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: 'users_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: 'users_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: 'users_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};
