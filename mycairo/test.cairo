func main() {
    [ap] = 1000, ap++;
    [ap] = 2000, ap++;
    [ap] = [ap - 2] + [ap - 1], ap++;
    ret;
}

// 编译 cairo-compile test.cairo --output test_compiled.json

// 运行 cairo-run --program=test_compiled.json --print_output --print_info --relocate_prints
// You can open the Cairo tracer by providing the --tracer flag to cairo-run. Then open it at http://localhost:8100/.