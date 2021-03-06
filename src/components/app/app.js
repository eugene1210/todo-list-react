import React, {Component} from 'react'

import AppHeader from "../app-header";      // Экспортирует AppHeader из /app-header/index.js читается WebPack'ом
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from "../item-add-form";

import './app.css'

export default class App extends Component {

    maxId = 100;

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch'),
        ],
        term: '',
        filter: 'all' // active, all, done
    }

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++
        }
    }

    // Удаление элементов
    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);
            const newArray = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ]
            return {
                todoData: newArray
            }
        })
    }

    // Добавление элементов
    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            const newArray = [
                ...todoData,
                newItem
            ]
            return {
                todoData: newArray
            }
        })
    }

    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            };
        });
    }

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            };
        });
    }

    toggleProperty(array, id, propName) {
        const idx = array.findIndex((el) => el.id === id);
        const oldItem = array[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};

        return [
            ...array.slice(0, idx),
            newItem,
            ...array.slice(idx + 1)
        ]
    }

    search(items, term) {
        if (term.length === 0) {
            return items;
        }
        return  items.filter((item) => {
            return item.label
                .toLowerCase()
                .indexOf(term.toLowerCase()) > -1;
        })
    }

    onSearchChange = (term) => {
        this.setState({term});
    }

    filter(items, filter) {
        switch (filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    }

    onFilterChange = (filter) => {
        this.setState({filter});
    }

    render() {

        const {todoData, term, filter} = this.state;
        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        const visibleItems = this.filter(this.search(todoData, term), filter);

        return (
            <div className='todo-app'>
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className='top-panel d-flex'>
                    <SearchPanel onSearchChange={this.onSearchChange}/>
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}/>
                </div>
                <TodoList
                    todos={visibleItems}
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}/>

                 <ItemAddForm onItemAdded={this.addItem}/>
            </div>
        );
    }
}
