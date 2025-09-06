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

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "user_notifications" */
  delete_user_notifications?: Maybe<User_Notifications_Mutation_Response>;
  /** delete single row from the table: "user_notifications" */
  delete_user_notifications_by_pk?: Maybe<User_Notifications>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "user_notifications" */
  insert_user_notifications?: Maybe<User_Notifications_Mutation_Response>;
  /** insert a single row into the table: "user_notifications" */
  insert_user_notifications_one?: Maybe<User_Notifications>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
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
