export default { title: 'theme/Icons' };

const icons = [
  'delete', 'account_off', 'account', 'ad', 'add_circle', 'add_user', 'add',
  'align_left', 'appearences', 'archive', 'arrow_down', 'arrow_up', 'metrics',
  'block', 'bulb', 'check_circle', 'click', 'clock', 'close_circle', 'close',
  'closed_lock', 'color', 'cols', 'computer', 'copy_file', 'copy', 'coupon',
  'credit_card_off', 'credit_card', 'dark_mode', 'dashboard', 'date_field',
  'delete_forever', 'diamond', 'discovery_pass', 'download', 'expand_less',
  'expand_more', 'field_click', 'field_text', 'field_type', 'file', 'foldable',
  'form', 'free_article', 'help_circle', 'image', 'info_circle', 'integration',
  'light_mode', 'list', 'magic_wand', 'more', 'multiline', 'newsletter',
  'notification', 'open_lock', 'ordered_list', 'password_field', 'pause', 'pen',
  'phone', 'play_circle', 'play', 'redo', 'refresh', 'revenues', 'row',
  'scenario', 'search', 'send', 'settings', 'stars', 'stats',
  'subscription_journey', 'subscription_page', 'subscription', 'success',
  'survey', 'switch', 'title', 'trigger', 'turnover', 'undo', 'unfold',
  'upload', 'url', 'user_edit', 'user_remove', 'user_substract', 'user_valid',
  'user', 'users', 'vertical_split', 'visibility_off', 'visibility',
];

export const All = () => (
  <div
    className="junipero"
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '8px',
    }}
  >
    { icons.map(icon => (
      <i key={icon} className="junipero-icons">{ icon }</i>
    )) }
  </div>
);
