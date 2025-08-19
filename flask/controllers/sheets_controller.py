from services.user_service import UserData
from services.ticket_service import TicketData
from config.sheets_config import pending_sheet, resolved_sheet
from flask import jsonify, Response

PENDING_SHEET_HEADERS = {
    'date': 'Date',
    'status': 'Status',
    'name': 'Name',
    'ticket': 'Ticket',
    'query': 'Query',
}

RESOLVED_SHEET_HEADERS = {
    
}

ESCALATED_STATUS = 'open - complex'
QUERY_MODE = 'Telegram' # config

# if query already exist in sheets?
# fallback data? (feasible?/should fail?)
def initial_query_entry(user_id: int, ticket_id: str, msg_id: int) -> tuple[Response, int]:
    try:
        user_data, ticket_data = UserData(), TicketData()

        ticket_date_open: str = ticket_data.ticket_dates(ticket_id)['open']
        ticket_status: str = ticket_data.status(ticket_id)
        user_name: str = user_data.user_name(user_id)
        user_query: str = ticket_data.query(ticket_id, msg_id)

        pending_query = [ticket_date_open, ticket_status, user_name, ticket_id, user_query]
        if not all(pending_query):
            raise ValueError('1 or more required data fields are missing or None')
        
        sheet_headers = pending_sheet.row_values(1) # refactor sheet validation, add to utils
        expected_headers = list(PENDING_SHEET_HEADERS.values())
        if sheet_headers != expected_headers:
            raise ValueError('Pending sheet headers mismatch')

        pending_sheet.insert_row(pending_query, index=2)

        return jsonify({'success': True, 'message': 'Query entry successfully created in sheets'}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500
    
# KIV date (need user_id if using date)
def update_to_escalated_query(ticket_id: str) -> tuple[Response, int]: # ✅
    try :
        ticket_data = TicketData()
        ticket_status: str = ticket_data.status(ticket_id)

        headers = pending_sheet.row_values(1)
        status_col = headers.index(PENDING_SHEET_HEADERS['status']) + 1
        ticket_col = headers.index(PENDING_SHEET_HEADERS['ticket']) + 1

        status_list: list[str] = pending_sheet.col_values(status_col)[1:]
        ticket_list: list[str]= pending_sheet.col_values(ticket_col)[1:]

        for idx, (status, ticket) in enumerate(zip(status_list, ticket_list), start=2):
            match_escalated_status = str(status).strip() == ESCALATED_STATUS
            match_ticket_status = str(status).strip() == str(ticket_status)
            match_ticket_id = str(ticket).strip() == str(ticket_id)

            if match_escalated_status and match_ticket_id:
                raise ValueError('Query has already been escalated')
            
            if match_ticket_status and match_ticket_id:
                pending_sheet.update_cell(idx, status_col, ESCALATED_STATUS)
                break
        else:
            raise ValueError('Query entry not found / Data mutated')

        return jsonify({'success': True, 'message': 'Query entry successfully escalated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# construct closed query entry (decide if query inludes all user data or separated)
# insert query into resolved sheet
# considerations: headers, data duplication, not found, code factoring
def archive_closed_query(user_id: int, ticket_id: str) -> tuple[Response, int]:
    user_data, ticket_data = UserData(), TicketData()
    ticket_date_open = ticket_data.ticket_dates(ticket_id)['open']
    # need to check status?

    pending_query_records = pending_sheet.get_all_records() # mem intensive?

    for index, row in enumerate(pending_query_records): # refactor into seperate delete function?
        if (row.get(PENDING_SHEET_HEADERS['date']) == ticket_date_open and # error handling
            row.get(PENDING_SHEET_HEADERS['ticket']) == ticket_id
        ):
            row_number = index + 2
            pending_sheet.delete_rows(row_number)
            break

    
    ticket_status = ticket_data.status(ticket_id)
    query_type = ticket_data.ticket_type(ticket_id)
    query_date_close = ticket_data.ticket_dates(ticket_id)['close']

    # for id in msg_id,
    # check role, assign user_name as user or agent
    # get query entry (user or agent)
    user_name = 1
    agent_name = 1
    query = 1
    agent_reply = 1
    archived_query = [
        ticket_date_open,
        ticket_status,
        user_name,
        ticket_id,
        query_type,
        QUERY_MODE,
        query_date_close,
        agent_name,
        query,
        agent_reply
    ]
    resolved_sheet.insert_row(archived_query, index=2)

    return jsonify({'success': True, 'message': 'Closed query successfully archived'})

# middleware usage?