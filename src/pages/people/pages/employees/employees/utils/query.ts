import { gql } from "@apollo/client";

export const PEOPLE_EMPLOYEES_QUERY_LIST = gql`
  query People__employees($where: CommonPaginationDto) {
    people__employees(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        address
        appointmentDate
        bloodGroup
        contactNumber
        createdAt
        department {
          name
          note
          _id
        }
        designation
        docs
        gender
        isActive
        joiningDate
        name
        religion
        salary
        startingSalary
        updatedAt
      }
    }
  }
`;

export const PEOPLE_EMPLOYEES_CREATE_MUTATION = gql`
  mutation People__createEmployee($body: CreateEmployeeInput!) {
    people__createEmployee(body: $body) {
      _id
    }
  }
`;

export const PEOPLE_EMPLOYEES_UPDATE_MUTATION = gql`
  mutation UpdateEmployee(
    $body: UpdateEmployeeInput!
    $where: CommonFindDocumentDto!
  ) {
    updateEmployee(body: $body, where: $where)
  }
`;

export const PEOPLE_EMPLOYEES_DELETE_MUTATION = gql`
  mutation removeEmployee($where: CommonFindDocumentDto!) {
    removeEmployee(where: $where)
  }
`;

export const PEOPLE_EMPLOYEE_DEPARTMENT_LIST_DROPDOWN = gql`
  query People__employeeDepartments($where: CommonPaginationDto) {
    people__employeeDepartments(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;
