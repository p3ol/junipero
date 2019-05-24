import React from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition }  from 'react-transition-group';

import { TagsField } from '@poool/junipero';

class TagsFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      autocomplete: {},
      animated: {},
      animating: false,
    };

    this.autoCompleteOptions = [
      'Dave',
      'Astrid',
      'Freeman',
      'Lizbeth',
      'Annette',
    ];
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>TagsField example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TagsField
              label="Keywords"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Type a keyword..."
              onChange={this.onChange.bind(this, 'default')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TagsField
              theme="none"
              label="Keywords"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Type a keyword..."
              onChange={this.onChange.bind(this, 'unthemed')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">With autocomplete</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TagsField
              label="Keywords"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Type a keyword..."
              onChange={this.onChange.bind(this, 'autocomplete')}
              autoCompleteUniqueValues={true}
              autoComplete={(val, cb) => {
                const search = new RegExp(val, 'i');
                cb(this.autoCompleteOptions.filter((item) => (
                  search.test(item)
                )));
              }}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.autocomplete, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Animated</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TagsField
              label="Keywords"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Type a keyword..."
              onChange={this.onChange.bind(this, 'animated')}
              autoCompleteUniqueValues={true}
              autoComplete={(val, cb) => {
                const search = new RegExp(val, 'i');
                cb(this.autoCompleteOptions.filter((item) => (
                  search.test(item)
                )));
              }}
              animateMenu={(menu) => (
                <CSSTransition
                  in={this.state.animating}
                  mountOnEnter={true}
                  unmountOnExit={true}
                  timeout={100}
                  classNames="slide-in-up-dropdown"
                  children={menu}
                />
              )}
              onToggle={opened => this.setState({ animating: opened })}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.animated, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TagsFieldPage;
