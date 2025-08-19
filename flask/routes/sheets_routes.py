from flask import Blueprint
from controllers import sheets_controller

sheets_routes = Blueprint('sheets_routes', __name__)

sheets_routes.route('/user/query/sheets/<user_id>/<ticket_id>/<msg_id>', methods=['POST'])(
    sheets_controller.initial_query_entry
)
sheets_routes.route('/agent/query/escalated/sheets/<ticket_id>', methods=['POST'])(
    sheets_controller.update_to_escalated_query
)
sheets_routes.route('/agent/query/restricted/sheets/<user_id>/<ticket_id>', methods=['POST'])(
    sheets_controller.archive_closed_query
)