# { "Depends": "py-genlayer:test" }
from genlayer import *

class TestContract(gl.Contract):
    counter: u256
    
    def __init__(self):
        self.counter = 1
    
    @gl.public.view
    def get_counter(self) -> int:
        return self.counter
    
    @gl.public.write
    def increment(self) -> int:
        self.counter += 1
        return self.counter
