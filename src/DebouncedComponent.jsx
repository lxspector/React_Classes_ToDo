import React from 'react';

class DebouncedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debouncedValue: this.props.value,
    };
    this.timerId = null;
  }

  updateDebouncedValue = () => {
    this.setState({ debouncedValue: this.props.value });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      clearTimeout(this.timerId);
      this.timerId = setTimeout(this.updateDebouncedValue, this.props.delay);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  render() {
    return (
      <div>
        <p>Debounced Value: {this.state.debouncedValue}</p>
      </div>
    );
  }
}

export default DebouncedComponent;
