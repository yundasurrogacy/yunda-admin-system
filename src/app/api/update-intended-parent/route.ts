import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentId, data } = body;

    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID is required' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    // 构建更新查询
    const mutation = `
      mutation UpdateIntendedParent($id: bigint!, $data: intended_parents_set_input!) {
        update_intended_parents_by_pk(pk_columns: {id: $id}, _set: $data) {
          id
          basic_information
          contact_information
          family_profile
          program_interests
          referral
          trust_account_balance
          email
          created_at
          updated_at
        }
      }
    `;

    // 准备更新数据 - 只包含允许更新的字段
    const updateData: any = {};
    
    if (data.basic_information) {
      updateData.basic_information = data.basic_information;
    }
    
    if (data.contact_information) {
      updateData.contact_information = data.contact_information;
    }
    
    if (data.family_profile) {
      updateData.family_profile = data.family_profile;
    }
    
    if (data.program_interests) {
      updateData.program_interests = data.program_interests;
    }
    
    if (data.referral) {
      updateData.referral = data.referral;
    }

    // 添加更新时间戳
    updateData.updated_at = new Date().toISOString();

    console.log('Updating parent data for ID:', parentId);
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const client = getHasuraClient();
    const result = await client.execute({ 
      query: mutation, 
      variables: { 
        id: Number(parentId), 
        data: updateData 
      } 
    });

    if (!result.update_intended_parents_by_pk) {
      return NextResponse.json(
        { error: 'Failed to update profile or parent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Profile updated successfully',
        data: result.update_intended_parents_by_pk
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating intended parent profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: String(error) },
      { status: 500 }
    );
  }
}