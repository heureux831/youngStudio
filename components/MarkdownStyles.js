import { Platform } from 'react-native';

// Markdown样式配置
export const markdownStyles = {
  body: {
    color: '#333',
    fontSize: 16,
    lineHeight: 20,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  paragraph: {
    marginBottom: 8,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    color: '#e91e63',
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  fence: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  list_item: {
    marginBottom: 4,
    color: '#333',
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
    paddingLeft: 16,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
  },
  th: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  td: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hr: {
    backgroundColor: '#ddd',
    height: 1,
    marginVertical: 16,
  },
}; 